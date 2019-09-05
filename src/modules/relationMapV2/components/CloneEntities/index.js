// @flow
import * as React from 'react';
import { findKey } from 'lodash';
import { Entities } from 'modules/relationMapV2/store';
import { RelationMapContext } from 'modules/relationMapV2/components/OrderFocus/store';
import { useMutation } from '@apollo/react-hooks';
import { ORDER, ORDER_ITEM, BATCH, CONTAINER, SHIPMENT } from 'modules/relationMapV2/constants';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import { cloneBatchesMutation, cloneOrderItemsMutation } from './mutation';
import { DialogStyle, ConfirmMessageStyle } from './style';

type Props = {|
  onSuccess: ({|
    orderIds: Array<string>,
    sources: Array<{ id: string, type: string }>,
    cloneEntities: Array<Object>,
  |}) => void,
|};

export default function CloneEntities({ onSuccess }: Props) {
  const { dispatch, state } = React.useContext(RelationMapContext);
  const { mapping } = Entities.useContainer();
  const [cloneBatches] = useMutation(cloneBatchesMutation);
  const [cloneOrderItems] = useMutation(cloneOrderItemsMutation);
  const {
    targets,
    clone: { isOpen, isProcessing },
  } = state;

  const totalOrders = targets.filter(target => target.includes(`${ORDER}-`)).length;
  const totalOrderItems = targets.filter(target => target.includes(`${ORDER_ITEM}-`)).length;
  const totalBatches = targets.filter(target => target.includes(`${BATCH}-`)).length;
  const totalContainers = targets.filter(target => target.includes(`${CONTAINER}-`)).length;
  const totalShipments = targets.filter(target => target.includes(`${SHIPMENT}-`)).length;

  React.useEffect(() => {
    if (isOpen && !isProcessing) {
      dispatch({
        type: 'CLONE_START',
        payload: {},
      });
    }
  }, [dispatch, isOpen, isProcessing]);

  React.useEffect(() => {
    async function doMutations() {
      const actions = [];
      const sources = [];
      const orderIds = [];
      if (totalBatches) {
        const batchIds = targets.filter(target => target.includes(`${BATCH}-`));
        const batches = [];
        batchIds.forEach(target => {
          const [, batchId] = target.split('-');
          const parentOrderPosition = findKey(mapping.orders, order => {
            return (order?.orderItems ?? []).some(orderItem =>
              (orderItem?.batches ?? []).map(batch => batch.id).includes(batchId)
            );
          });
          if (
            mapping.orders?.[parentOrderPosition]?.id &&
            !orderIds.includes(mapping.orders?.[parentOrderPosition]?.id)
          ) {
            orderIds.push(mapping.orders?.[parentOrderPosition]?.id);
          }
          sources.push({
            type: BATCH,
            id: batchId,
          });

          batches.push({
            id: batchId,
            input: {
              deliveredAt: null,
              desiredAt: null,
              expiredAt: null,
              customFields: null,
              producedAt: null,
              batchQuantityRevisions: [],
            },
          });
        });

        actions.push(
          cloneBatches({
            variables: {
              batches,
            },
          })
        );
      }
      if (totalOrderItems) {
        const orderItemIds = targets.filter(target => target.includes(`${ORDER_ITEM}-`));
        const orderItems = [];
        orderItemIds.forEach(target => {
          const [, orderItemId] = target.split('-');
          const parentOrderPosition = findKey(mapping.orders, order => {
            return (order?.orderItems ?? []).some(orderItem => orderItem?.id === orderItemId);
          });
          if (
            mapping.orders?.[parentOrderPosition]?.id &&
            !orderIds.includes(mapping.orders?.[parentOrderPosition]?.id)
          ) {
            orderIds.push(mapping.orders?.[parentOrderPosition]?.id);
          }
          sources.push({
            type: ORDER_ITEM,
            id: orderItemId,
          });

          orderItems.push({
            id: orderItemId,
            input: {
              batches: [],
            },
          });
        });

        actions.push(
          cloneOrderItems({
            variables: {
              orderItems,
            },
          })
        );
      }
      try {
        const cloneEntities = await Promise.all(actions);
        dispatch({
          type: 'CLONE_END',
          payload: {
            sources,
            cloneEntities,
          },
        });
        onSuccess({ sources, cloneEntities, orderIds });
      } catch (error) {
        dispatch({
          type: 'CLONE_END',
          payload: {
            error,
          },
        });
      }
    }
    if (isProcessing && isOpen) {
      doMutations();
    }
  }, [
    cloneBatches,
    cloneOrderItems,
    dispatch,
    isOpen,
    isProcessing,
    mapping.entities,
    mapping.orders,
    onSuccess,
    targets,
    totalBatches,
    totalOrderItems,
  ]);

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
