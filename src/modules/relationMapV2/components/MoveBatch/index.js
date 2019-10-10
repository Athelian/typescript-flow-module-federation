// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import useUser from 'hooks/useUser';
import { Tooltip } from 'components/Tooltip';
import { Entities, FocusedView } from 'modules/relationMapV2/store';
import { targetedIds, findOrderIdByBatch } from 'modules/relationMapV2/helpers';
import { BATCH } from 'modules/relationMapV2/constants';
import { BATCH_UPDATE, BATCH_SET_ORDER_ITEM } from 'modules/permission/constants/batch';
import { BaseButton } from 'components/Buttons';
import { useAllHasPermission } from 'components/Context/Permissions';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import { CONTAINER_CREATE } from 'modules/permission/constants/container';
import FormattedNumber from 'components/FormattedNumber';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_ADD_BATCH,
  SHIPMENT_CREATE,
} from 'modules/permission/constants/shipment';
import ActionDialog, { BatchesLabelIcon, BatchLabelIcon } from '../ActionDialog';
import SelectOrderToMove from './components/SelectOrderToMove';
import SelectShipmentToMove from './components/SelectShipmentToMove';
import SelectContainerToMove from './components/SelectContainerToMove';

type Props = {
  onSuccess: (orderIds: Array<string>) => void,
};

export default function MoveBatch({ onSuccess }: Props) {
  const { isExporter } = useUser();
  const { mapping } = Entities.useContainer();
  const { dispatch, state } = FocusedView.useContainer();
  const batchIds = targetedIds(state.targets, BATCH);
  const orderIds = [
    ...new Set(
      batchIds.map(batchId => findOrderIdByBatch(batchId, mapping.entities)).filter(Boolean)
    ),
  ];
  const containerIds = [
    ...new Set(
      batchIds.map(batchId => mapping.entities?.batches?.[batchId]?.container).filter(Boolean)
    ),
  ];
  const shipmentIds = [
    ...new Set(
      batchIds.map(batchId => mapping.entities?.batches?.[batchId]?.shipment).filter(Boolean)
    ),
  ];
  const totalBatches = batchIds.length;
  const { isProcessing, isOpen, type } = state.batchActions;
  const isMoveBatches = type === 'moveBatches';

  const onCancel = () => {
    dispatch({
      type: 'MOVE_BATCH_CLOSE',
      payload: {},
    });
  };

  const hasPermissions = useAllHasPermission(
    batchIds.map(batchId => mapping.entities?.batches?.[batchId]?.ownedBy).filter(Boolean)
  );

  const importerIds = [];
  const exporterIds = [];
  orderIds.forEach(orderId => {
    const order = mapping.entities?.orders?.[orderId];
    const importId = order?.importer?.id;
    const exporterId = order?.exporter?.id;
    if (importId && !importerIds.includes(importId)) {
      importerIds.push(importId);
    }
    if (exporterId && !exporterIds.includes(exporterId)) {
      exporterIds.push(exporterId);
    }
  });

  const onNewContainer = (shipment: Object) => {
    dispatch({
      type: 'MOVE_BATCH_TO_NEW_ENTITY',
      payload: {
        type: 'MOVE_BATCHES',
        selectedId: 'newContainer',
        shipment,
        orderIds,
        containerIds,
        shipmentIds,
        importerIds,
        exporterIds,
      },
    });
  };

  const onConfirm = (
    // prettier-ignore
    target: | 'existOrder'
      | 'newOrder'
      | 'existContainer'
      | 'newContainer'
      | 'existShipment'
      | 'newShipment'
  ) => {
    switch (target) {
      case 'newOrder':
      case 'newShipment':
        dispatch({
          type: 'MOVE_BATCH_TO_NEW_ENTITY',
          payload: {
            type: 'MOVE_BATCHES',
            selectedId: target,
            orderIds,
            containerIds,
            shipmentIds,
            importerIds,
            exporterIds,
          },
        });
        break;

      default:
        dispatch({
          type: 'MOVE_BATCH_START',
          payload: {
            type: target,
            orderIds,
            containerIds,
            shipmentIds,
            importerIds,
            exporterIds,
          },
        });
    }
  };

  const isSamePartners = () => {
    return importerIds.length <= 1 && exporterIds.length <= 1;
  };

  const isSameImporter = () => {
    return importerIds.length <= 1;
  };

  const hasPermissionMoveToExistOrder = () => {
    return isSamePartners() && hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM]);
  };

  const hasPermissionMoveToExistContainer = () => {
    return isSameImporter() && hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM]);
  };

  const hasPermissionMoveToExistShipment = () => {
    return isSameImporter() && hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM]);
  };

  const hasPermissionMoveToNewOrder = () => {
    return (
      isSamePartners() &&
      hasPermissions(ORDER_CREATE) &&
      hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM])
    );
  };

  const hasPermissionMoveToNewContainer = () => {
    return (
      isSameImporter() &&
      hasPermissions(CONTAINER_CREATE) &&
      hasPermissions([SHIPMENT_UPDATE, SHIPMENT_ADD_BATCH]) &&
      hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM])
    );
  };

  const hasPermissionMoveToNewShipment = () => {
    return isExporter()
      ? isSamePartners()
      : isSameImporter() &&
          hasPermissions(SHIPMENT_CREATE) &&
          hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM]);
  };

  const noPermission =
    !hasPermissionMoveToExistOrder() &&
    !hasPermissionMoveToNewOrder() &&
    !hasPermissionMoveToExistContainer() &&
    !hasPermissionMoveToNewContainer() &&
    !hasPermissionMoveToExistShipment() &&
    !hasPermissionMoveToNewShipment();

  let dialogMessage = null;
  let dialogSubMessage = null;

  if (noPermission) {
    // No permission to move anywhere
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.move.noPermission"
        defaultMessage="At least one {batchLabel} selected does not allow you to move it anywhere"
        values={{ batchLabel: <BatchLabelIcon /> }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        id="modules.RelationMap.actions.tryAgain"
        defaultMessage="Please reselect and try again."
      />
    );
  } else if (isProcessing) {
    // Is currently moving
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.move.moving"
        defaultMessage="Moving {numOfBatches} {batchesLabel} ..."
        values={{
          numOfBatches: <FormattedNumber value={totalBatches} />,
          batchesLabel: totalBatches > 1 ? <BatchesLabelIcon /> : <BatchLabelIcon />,
        }}
      />
    );
  } else {
    // Has permission to move
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.move.message1"
        defaultMessage="Where would you like to move the {numOfBatches} {batchesLabel} that you have selected?"
        values={{
          numOfBatches: <FormattedNumber value={totalBatches} />,
          batchesLabel: totalBatches > 1 ? <BatchesLabelIcon /> : <BatchLabelIcon />,
        }}
      />
    );
  }

  return (
    <>
      <ActionDialog
        isOpen={isOpen && isMoveBatches}
        isProcessing={isProcessing}
        onCancel={onCancel}
        title={<FormattedMessage id="modules.RelationMap.label.move" defaultMessage="MOVE" />}
        dialogMessage={dialogMessage}
        dialogSubMessage={dialogSubMessage}
        buttons={
          <>
            {!hasPermissionMoveToExistOrder() ? (
              <Tooltip
                message={
                  !isSamePartners() ? (
                    <FormattedMessage
                      id="modules.RelationMap.move.moveToOrderSamePartnersTooltip"
                      defaultMessage="At least one selected Batch has a different Importer or Exporter from the others. You can only move Batches to a different Order if they all have the same Importer and Exporter."
                    />
                  ) : (
                    <FormattedMessage
                      id="modules.RelationMap.move.noPermissionTooltip"
                      defaultMessage="At least one selected Batch does not give you permission to move it."
                    />
                  )
                }
              >
                <div>
                  <BaseButton
                    label={
                      <FormattedMessage
                        id="modules.RelationMap.label.moveTo"
                        defaultMessage="MOVE TO"
                      />
                    }
                    icon="ORDER"
                    disabled
                  />
                </div>
              </Tooltip>
            ) : (
              <BaseButton
                label={
                  <FormattedMessage
                    id="modules.RelationMap.label.moveTo"
                    defaultMessage="MOVE TO"
                  />
                }
                icon="ORDER"
                onClick={() => onConfirm('existOrder')}
              />
            )}

            {!hasPermissionMoveToNewOrder() ? (
              <Tooltip
                message={
                  !isSamePartners() ? (
                    <FormattedMessage
                      id="modules.RelationMap.move.moveToOrderSamePartnersTooltip"
                      defaultMessage="At least one selected Batch has a different Importer or Exporter from the others. You can only move Batches to a different Order if they all have the same Importer and Exporter."
                    />
                  ) : (
                    <FormattedMessage
                      id="modules.RelationMap.move.noPermissionTooltip"
                      defaultMessage="At least one selected Batch does not give you permission to move it."
                    />
                  )
                }
              >
                <div>
                  <BaseButton
                    label={
                      <FormattedMessage
                        id="modules.RelationMap.label.moveToNew"
                        defaultMessage="MOVE TO NEW"
                      />
                    }
                    icon="ORDER"
                    disabled
                  />
                </div>
              </Tooltip>
            ) : (
              <BaseButton
                label={
                  <FormattedMessage
                    id="modules.RelationMap.label.moveToNew"
                    defaultMessage="MOVE TO NEW"
                  />
                }
                icon="ORDER"
                onClick={() => onConfirm('newOrder')}
              />
            )}

            {!hasPermissionMoveToExistContainer() ? (
              <Tooltip
                message={
                  !isSameImporter() ? (
                    <FormattedMessage
                      id="modules.RelationMap.move.moveToContainerSameImportersTooltip"
                      defaultMessage="At least one selected Batch has a different Importer from the others. You can only move Batches to a different Container if they all have the same Importer."
                    />
                  ) : (
                    <FormattedMessage
                      id="modules.RelationMap.move.noPermissionTooltip"
                      defaultMessage="At least one selected Batch does not give you permission to move it."
                    />
                  )
                }
              >
                <div>
                  <BaseButton
                    label={
                      <FormattedMessage
                        id="modules.RelationMap.label.moveTo"
                        defaultMessage="MOVE TO"
                      />
                    }
                    icon="CONTAINER"
                    disabled
                  />
                </div>
              </Tooltip>
            ) : (
              <BaseButton
                label={
                  <FormattedMessage
                    id="modules.RelationMap.label.moveTo"
                    defaultMessage="MOVE TO"
                  />
                }
                icon="CONTAINER"
                onClick={() => onConfirm('existContainer')}
              />
            )}

            {!hasPermissionMoveToNewContainer() ? (
              <Tooltip
                message={
                  !isSameImporter() ? (
                    <FormattedMessage
                      id="modules.RelationMap.move.moveToContainerSameImportersTooltip"
                      defaultMessage="At least one selected Batch has a different Importer from the others. You can only move Batches to a different Container if they all have the same Importer."
                    />
                  ) : (
                    <FormattedMessage
                      id="modules.RelationMap.move.noPermissionTooltip"
                      defaultMessage="At least one selected Batch does not give you permission to move it."
                    />
                  )
                }
              >
                <div>
                  <BaseButton
                    label={
                      <FormattedMessage
                        id="modules.RelationMap.label.moveToNew"
                        defaultMessage="MOVE TO NEW"
                      />
                    }
                    icon="CONTAINER"
                    disabled
                  />
                </div>
              </Tooltip>
            ) : (
              <BaseButton
                label={
                  <FormattedMessage
                    id="modules.RelationMap.label.moveToNew"
                    defaultMessage="MOVE TO NEW"
                  />
                }
                icon="CONTAINER"
                onClick={() => onConfirm('newContainer')}
              />
            )}

            {!hasPermissionMoveToExistShipment() ? (
              <Tooltip
                message={
                  !isSameImporter() ? (
                    <FormattedMessage
                      id="modules.RelationMap.move.moveToShipmentSameImportersTooltip"
                      defaultMessage="At least one selected Batch has a different Importer from the others. You can only move Batches to a different Shipment if they all have the same Importer."
                    />
                  ) : (
                    <FormattedMessage
                      id="modules.RelationMap.move.noPermissionTooltip"
                      defaultMessage="At least one selected Batch does not give you permission to move it."
                    />
                  )
                }
              >
                <div>
                  <BaseButton
                    label={
                      <FormattedMessage
                        id="modules.RelationMap.label.moveTo"
                        defaultMessage="MOVE TO"
                      />
                    }
                    icon="SHIPMENT"
                    disabled
                  />
                </div>
              </Tooltip>
            ) : (
              <BaseButton
                label={
                  <FormattedMessage
                    id="modules.RelationMap.label.moveTo"
                    defaultMessage="MOVE TO"
                  />
                }
                icon="SHIPMENT"
                onClick={() => onConfirm('existShipment') || !hasPermissionMoveToExistShipment()}
              />
            )}

            {!hasPermissionMoveToNewShipment() ? (
              <Tooltip
                message={
                  !isSameImporter() ? (
                    <FormattedMessage
                      id="modules.RelationMap.move.moveToShipmentSameImportersTooltip"
                      defaultMessage="At least one selected Batch has a different Importer from the others. You can only move Batches to a different Shipment if they all have the same Importer."
                    />
                  ) : (
                    <FormattedMessage
                      id="modules.RelationMap.move.noPermissionTooltip"
                      defaultMessage="At least one selected Batch does not give you permission to move it."
                    />
                  )
                }
              >
                <div>
                  <BaseButton
                    label={
                      <FormattedMessage
                        id="modules.RelationMap.label.moveToNew"
                        defaultMessage="MOVE TO NEW"
                      />
                    }
                    icon="SHIPMENT"
                    disabled
                  />
                </div>
              </Tooltip>
            ) : (
              <BaseButton
                label={
                  <FormattedMessage
                    id="modules.RelationMap.label.moveToNew"
                    defaultMessage="MOVE TO NEW"
                  />
                }
                icon="SHIPMENT"
                onClick={() => onConfirm('newShipment')}
              />
            )}
          </>
        }
      />

      <SelectOrderToMove onSuccess={onSuccess} />
      <SelectShipmentToMove onSuccess={onSuccess} onNewContainer={onNewContainer} />
      <SelectContainerToMove onSuccess={onSuccess} />
    </>
  );
}
