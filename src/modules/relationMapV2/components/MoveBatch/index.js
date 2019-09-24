// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { BATCH } from 'modules/relationMapV2/constants';
import Dialog from 'components/Dialog';
import { BaseButton, CancelButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';
import SelectOrderToMove from './components/SelectOrderToMove';

export default function MoveBatch() {
  const { dispatch, state } = React.useContext(RelationMapContext);
  const totalBatches = state.targets.filter(item => item.includes(`${BATCH}-`)).length;
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

  const hasPermissionMoveToExistOrder = () => {
    return true;
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
