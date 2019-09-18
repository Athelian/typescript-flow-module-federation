// @flow
import * as React from 'react';
import { Entities } from 'modules/relationMapV2/store';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { useMutation } from '@apollo/react-hooks';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import { cloneBatchesMutation, cloneOrderItemsMutation, cloneOrdersMutation } from './mutation';
import { DialogStyle, ConfirmMessageStyle } from './style';

type Props = {|
  onSuccess: ({|
    orderIds: Array<string>,
    newOrderItemPositions: Object,
    sources: Array<{ id: string, type: string }>,
    cloneEntities: Array<Object>,
  |}) => void,
|};

export default function AddTags({ onSuccess }: Props) {
  const { dispatch, state } = React.useContext(RelationMapContext);
  const { mapping } = Entities.useContainer();
  const [cloneBatches] = useMutation(cloneBatchesMutation);
  const [cloneOrderItems] = useMutation(cloneOrderItemsMutation);
  const [cloneOrders] = useMutation(cloneOrdersMutation);
  const {
    targets,
    tags: { isOpen, isProcessing, source },
  } = state;

  const totalOrders = targets.filter(target => target.includes(`${ORDER}-`)).length;
  const totalOrderItems = targets.filter(target => target.includes(`${ORDER_ITEM}-`)).length;
  const totalBatches = targets.filter(target => target.includes(`${BATCH}-`)).length;
  const totalContainers = targets.filter(target => target.includes(`${CONTAINER}-`)).length;
  const totalShipments = targets.filter(target => target.includes(`${SHIPMENT}-`)).length;

  // TODO: show the dialog
  // TODO: trigger mutation on click
  console.warn({
    dispatch,
    mapping,
    cloneBatches,
    cloneOrderItems,
    cloneOrders,
    isProcessing,
    onSuccess,
  });

  return (
    <Dialog isOpen={isOpen} width="400px">
      <div className={DialogStyle}>
        <h3 className={ConfirmMessageStyle}>
          Select tags to add to the{' '}
          {totalOrders > 0 && source === ORDER && (
            <>
              {totalOrders} <Icon icon="ORDER" />
            </>
          )}
          {totalOrderItems > 0 && source === ORDER_ITEM && (
            <>
              {totalOrderItems} <Icon icon="ORDER_ITEM" />
            </>
          )}
          {totalBatches > 0 && source === BATCH && (
            <>
              {totalBatches} <Icon icon="BATCH" />
            </>
          )}
          {totalContainers > 0 && source === CONTAINER && (
            <>
              {totalContainers} <Icon icon="CONTAINER" />
            </>
          )}
          {totalShipments > 0 && source === SHIPMENT && (
            <>
              {totalShipments} <Icon icon="SHIPMENT" />
            </>
          )}
          that you have selected
        </h3>
        <LoadingIcon />
      </div>
    </Dialog>
  );
}
