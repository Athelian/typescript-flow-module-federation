// @flow
import * as React from 'react';
import { findKey, flattenDeep } from 'lodash';
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
    sources: Array<{ id: string, type: string }>,
    cloneEntities: Array<Object>,
  |}) => void,
  viewer?: 'ORDER_FOCUS' | 'SHIPMENT_FOCUS',
|};

export default function CloneEntities({ onSuccess, viewer }: Props) {
  const { dispatch, state } = React.useContext(RelationMapContext);
  const { mapping } = Entities.useContainer();
  const [cloneBatches] = useMutation(cloneBatchesMutation);
  const [cloneOrderItems] = useMutation(cloneOrderItemsMutation);
  const [cloneOrders] = useMutation(cloneOrdersMutation);
  const {
    targets,
    clone: { isOpen, isProcessing, source },
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
      const processOrderIds = [];
      if (totalBatches && source === BATCH) {
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
              shipmentId: null,
              containerId: null,
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
      if (totalOrderItems && source === ORDER_ITEM) {
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

          // clone order item along with batches has been targeted
          orderItems.push({
            id: orderItemId,
            input: {
              batches: (mapping.entities?.orderItems?.[orderItemId]?.batches ?? [])
                .filter(batchId => targets.includes(`${BATCH}-${batchId}`))
                .map(id => ({
                  id,
                })),
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
      if (totalOrders && source === ORDER) {
        const orderInputIds = targets.filter(target => target.includes(`${ORDER}-`));
        const orders = [];
        orderInputIds.forEach(target => {
          const [, orderId] = target.split('-');
          sources.push({
            type: ORDER_ITEM,
            id: orderId,
          });

          // clone order item along with batches has been targeted
          processOrderIds.push(orderId);
          orders.push({
            id: orderId,
            input: {
              orderItems: (mapping.entities?.orders?.[orderId]?.orderItems ?? [])
                .filter(itemId => targets.includes(`${ORDER_ITEM}-${itemId}`))
                .map(orderItemId => ({
                  id: orderItemId,
                  batches: (mapping.entities?.orderItems?.[orderItemId]?.batches ?? [])
                    .filter(batchId => targets.includes(`${BATCH}-${batchId}`))
                    .map(id => ({
                      id,
                    })),
                })),
            },
          });
        });
        // create new item when there is a batch without parent
        const processBatchesIds = flattenDeep(
          orders.map(order =>
            order.input.orderItems.map(item => item.batches.map(batch => batch.id))
          )
        );

        const batchIds = targets.filter(target => target.includes(`${BATCH}-`));
        batchIds.forEach(target => {
          const [, batchId] = target.split('-');
          const parentOrderPosition = findKey(mapping.orders, order => {
            return (order?.orderItems ?? []).some(orderItem =>
              (orderItem?.batches ?? []).map(batch => batch.id).includes(batchId)
            );
          });
          const parentOrder = mapping.orders[parentOrderPosition];
          const batch = mapping.entities?.batches[batchId];
          if (processOrderIds.includes(parentOrder?.id) && !processBatchesIds.includes(batchId)) {
            const orderItemId = findKey(mapping.entities?.orderItems, orderItem => {
              return (orderItem.batches || []).includes(batchId);
            });

            const parentItem = mapping.entities?.orderItems?.[orderItemId] ?? {
              no: 'N/A',
              price: {
                amount: 0,
                currency: parentOrder.currency,
              },
            };

            orders.push({
              id: parentOrder?.id,
              input: {
                orderItems: [
                  {
                    productProviderId: parentItem?.productProvider?.id,
                    no: `[auto] ${parentItem?.no}`,
                    quantity: batch.latestQuantity,
                    price: { amount: parentItem.price.amount, currency: parentItem.price.currency },
                    batches: [{ id: batchId }],
                  },
                ],
              },
            });
          }
        });

        actions.push(
          cloneOrders({
            variables: {
              orders,
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
    cloneOrders,
    dispatch,
    isOpen,
    isProcessing,
    mapping.entities,
    mapping.orders,
    onSuccess,
    source,
    targets,
    totalBatches,
    totalContainers,
    totalOrderItems,
    totalOrders,
    viewer,
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
          {viewer === 'SHIPMENT_FOCUS' && (
            <>
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
            </>
          )}
          {`...`}
        </h3>
        <LoadingIcon />
      </div>
    </Dialog>
  );
}
