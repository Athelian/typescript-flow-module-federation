// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { Entities } from 'modules/relationMapV2/store';
import { BATCH } from 'modules/relationMapV2/constants';
import { BATCH_UPDATE, BATCH_SET_ORDER_ITEM } from 'modules/permission/constants/batch';
import Dialog from 'components/Dialog';
import { BaseButton, CancelButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { useAllHasPermission } from 'components/Context/Permissions';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';
import SelectOrderToMove from './components/SelectOrderToMove';
import { targetedIds, findOrderIdByBatch } from '../OrderFocus/helpers';

export default function MoveBatch() {
  const { mapping } = Entities.useContainer();
  const { dispatch, state } = React.useContext(RelationMapContext);
  const batchIds = targetedIds(state.targets, BATCH);
  const orderIds = batchIds
    .map(batchId => findOrderIdByBatch(batchId, mapping.entities))
    .filter(Boolean);
  const totalBatches = batchIds.length;
  const { isProcessing, isOpen, type } = state.batchActions;
  const isMoveBatches = type === 'moveBatches';
  const onCancel = () => {
    dispatch({
      type: 'MOVE_BATCH_CLOSE',
      payload: {},
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
    dispatch({
      type: 'MOVE_BATCH_START',
      payload: {
        type: target,
      },
    });
  };

  const hasPermissions = useAllHasPermission(
    batchIds.map(batchId => mapping.entities?.batches?.[batchId]?.ownedBy).filter(Boolean)
  );

  const hasPermissionMoveToExistOrder = () => {
    // all selected Batches have same Importer && Exporter)
    const importerIds = [];
    const exportIds = [];
    orderIds.forEach(orderId => {
      const order = mapping.entities?.orders?.[orderId];
      const importId = order?.importer?.id;
      const exportId = order?.exporter?.id;
      if (importId && !importerIds.includes(importId)) {
        importerIds.push(importId);
      }
      if (exportId && !exportIds.includes(exportId)) {
        exportIds.push(exportId);
      }
    });

    if (importerIds.length > 1 || exportIds.length > 1) return false;

    // check permission to move batch
    return hasPermissions([BATCH_UPDATE, BATCH_SET_ORDER_ITEM]);
  };

  const hasPermissionMoveToExistContainer = () => {
    return true;
  };

  const hasPermissionMoveToExistShipment = () => {
    return true;
  };

  const hasPermissionMoveToNewOrder = () => {
    return true;
  };

  const hasPermissionMoveToNewContainer = () => {
    return true;
  };

  const hasPermissionMoveToNewShipment = () => {
    return true;
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
      <SelectOrderToMove />
    </Dialog>
  );
}
