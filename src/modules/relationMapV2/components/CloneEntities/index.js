// @flow
import * as React from 'react';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import { DialogStyle, ConfirmMessageStyle } from './style';

type Props = {|
  onSuccess: (string, Array<Object>) => void,
|};

export default function CloneEntities({ onSuccess }: Props) {
  const { dispatch, state } = React.useContext(RelationMapContext);
  const {
    targets,
    clone: { isOpen, isProcessing },
  } = state;

  React.useEffect(() => {
    if (isOpen && !isProcessing) {
      dispatch({
        type: 'CLONE_START',
        payload: {},
      });
    }
  }, [dispatch, isOpen, isProcessing]);

  React.useEffect(() => {
    if (isProcessing && isOpen) {
      // if (batchResult.data && batchResult.data) {
      //   dispatch({
      //     type: 'CLONE_END',
      //     payload: {
      //       batch: batchResult.data?.batchCreate ?? {},
      //     },
      //   });
      //   onSuccess(
      //     batchResult.data?.batchCreate?.orderItem?.order?.id,
      //     batchResult.data?.batchCreate
      //   );
      //   onSetBadge(batchResult.data?.batchCreate?.id, 'newItem');
      // } else if (batchResult.error) {
      //   dispatch({
      //     type: 'CLONE_END',
      //     payload: {
      //       error: batchResult.error,
      //     },
      //   });
      // }
    }
  }, [dispatch, isOpen, isProcessing, onSuccess]);

  const totalOrders = targets.filter(target => target.includes(`${ORDER}-`)).length;
  const totalOrderItems = targets.filter(target => target.includes(`${ORDER_ITEM}-`)).length;
  const totalBatches = targets.filter(target => target.includes(`${BATCH}-`)).length;
  const totalContainers = targets.filter(target => target.includes(`${CONTAINER}-`)).length;
  const totalShipments = targets.filter(target => target.includes(`${SHIPMENT}-`)).length;

  return (
    <Dialog isOpen={isOpen} width="400px">
      <div className={DialogStyle}>
        <h3 className={ConfirmMessageStyle}>
          Cloning{' '}
          {totalOrders > 0 && (
            <>
              {totalOrders} <Icon icon="ORDER" />
            </>
          )}{' '}
          {totalOrderItems > 0 && (
            <>
              {totalOrderItems} <Icon icon="ORDER_ITEM" />
            </>
          )}{' '}
          {totalBatches > 0 && (
            <>
              {totalBatches} <Icon icon="BATCH" />
            </>
          )}{' '}
          {totalContainers > 0 && (
            <>
              {totalContainers} <Icon icon="CONTAINER" />
            </>
          )}{' '}
          {totalShipments > 0 && (
            <>
              {totalShipments} <Icon icon="SHIPMENT" />
            </>
          )}{' '}
          {`...`}
        </h3>
        <LoadingIcon />
      </div>
    </Dialog>
  );
}
