// @flow
import * as React from 'react';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { BATCH } from 'modules/relationMapV2/constants';
import Dialog from 'components/Dialog';
import { BaseButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';

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
        target,
      },
    });
  };
  return (
    <Dialog isOpen={isOpen && isMoveBatches} width="660px" onRequestClose={onCancel}>
      <div className={DialogStyle}>
        <h3 className={ConfirmMessageStyle}>
          Where would you like to move these {totalBatches} Batches <Icon icon="BATCH" /> to ?
        </h3>
        <div className={ButtonsStyle}>
          <BaseButton
            label="Order"
            disabled={Boolean(isProcessing)}
            onClick={() => onConfirm('existOrder')}
          />
          <BaseButton
            label="New Order"
            disabled={Boolean(isProcessing)}
            onClick={() => onConfirm('newOrder')}
          />
          <BaseButton
            label="Container"
            disabled={Boolean(isProcessing)}
            onClick={() => onConfirm('existContainer')}
          />
          <BaseButton
            label="New Container"
            disabled={Boolean(isProcessing)}
            onClick={() => onConfirm('newContainer')}
          />
          <BaseButton
            label="Shipment"
            disabled={Boolean(isProcessing)}
            onClick={() => onConfirm('existShipment')}
          />
          <BaseButton
            label="New Shipment"
            disabled={Boolean(isProcessing)}
            onClick={() => onConfirm('newShipment')}
          />
        </div>
      </div>
    </Dialog>
  );
}
