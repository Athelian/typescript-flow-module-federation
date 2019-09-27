// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import useUser from 'hooks/useUser';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { Entities } from 'modules/relationMapV2/store';
import { BATCH } from 'modules/relationMapV2/constants';
import { BATCH_UPDATE, BATCH_SET_ORDER_ITEM } from 'modules/permission/constants/batch';
import Dialog from 'components/Dialog';
import { BaseButton, CancelButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { useAllHasPermission } from 'components/Context/Permissions';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import { CONTAINER_CREATE } from 'modules/permission/constants/container';
import {
  SHIPMENT_UPDATE,
  SHIPMENT_ADD_BATCH,
  SHIPMENT_CREATE,
} from 'modules/permission/constants/shipment';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';
import SelectOrderToMove from './components/SelectOrderToMove';
import SelectShipmentToMove from './components/SelectShipmentToMove';
import SelectContainerToMove from './components/SelectContainerToMove';
import { targetedIds, findOrderIdByBatch } from '../OrderFocus/helpers';

type Props = {
  onSuccess: (orderIds: Array<string>) => void,
};

export default function MoveBatch({ onSuccess }: Props) {
  const { isExporter } = useUser();
  const { mapping } = Entities.useContainer();
  const { dispatch, state } = React.useContext(RelationMapContext);
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

  const noPermission = () => {
    return (
      !hasPermissionMoveToExistOrder() &&
      !hasPermissionMoveToNewOrder() &&
      !hasPermissionMoveToExistContainer() &&
      !hasPermissionMoveToNewContainer() &&
      !hasPermissionMoveToExistShipment() &&
      !hasPermissionMoveToNewShipment()
    );
  };

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

  return (
    <Dialog isOpen={isOpen && isMoveBatches} width="660px" onRequestClose={onCancel}>
      <div className={DialogStyle}>
        {noPermission() ? (
          <>
            <FormattedMessage
              id="modules.RelationMap.move.noPermissionToMove"
              defaultMessage="Your selection of Batches {entity} do not allow you to move them.Please reselect and try again."
              values={{
                entity: <Icon icon="BATCH" />,
              }}
            />
            <CancelButton onClick={onCancel} />
          </>
        ) : (
          <>
            <h3 className={ConfirmMessageStyle}>
              <FormattedMessage
                id="modules.RelationMap.move.guideline"
                defaultMessage="Where would you like to move these {total, plural, one {# Batch} other {# Batches}} {entity} to?"
                values={{
                  total: totalBatches,
                  entity: <Icon icon="BATCH" />,
                }}
              />
            </h3>
            <div className={ButtonsStyle}>
              <BaseButton
                label="Order"
                disabled={Boolean(isProcessing) || !hasPermissionMoveToExistOrder()}
                onClick={() => onConfirm('existOrder')}
              />
              <BaseButton
                label="New Order"
                disabled={Boolean(isProcessing) || !hasPermissionMoveToNewOrder()}
                onClick={() => onConfirm('newOrder')}
              />
              <BaseButton
                label="Container"
                disabled={Boolean(isProcessing) || !hasPermissionMoveToExistContainer()}
                onClick={() => onConfirm('existContainer')}
              />
              <BaseButton
                label="New Container"
                disabled={Boolean(isProcessing) || !hasPermissionMoveToNewContainer()}
                onClick={() => onConfirm('newContainer')}
              />
              <BaseButton
                label="Shipment"
                disabled={Boolean(isProcessing)}
                onClick={() => onConfirm('existShipment') || !hasPermissionMoveToExistShipment()}
              />
              <BaseButton
                label="New Shipment"
                disabled={Boolean(isProcessing) || !hasPermissionMoveToNewShipment()}
                onClick={() => onConfirm('newShipment')}
              />
            </div>
          </>
        )}
      </div>
      <SelectOrderToMove onSuccess={onSuccess} />
      <SelectShipmentToMove onSuccess={onSuccess} onNewContainer={onNewContainer} />
      <SelectContainerToMove onSuccess={onSuccess} />
    </Dialog>
  );
}
