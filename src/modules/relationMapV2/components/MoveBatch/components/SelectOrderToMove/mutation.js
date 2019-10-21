// @flow
import apolloClient from 'apollo';
import { updateOrderMutation } from 'modules/order/form/mutation';
import { findShipmentIdByBatch, findParentIdsByBatch } from 'modules/relationMapV2/helpers';

export const moveBatchesToOrder = ({
  batchIds,
  order,
  entities,
  viewer,
}: {
  batchIds: Array<string>,
  order: Object,
  entities: Object,
  viewer: string,
}) => {
  const orderItems = [];
  const orderIds = [];
  batchIds.forEach(batchId => {
    const [orderItemId, parentOrderId] = findParentIdsByBatch({
      batchId,
      entities,
      viewer,
    });
    if (orderItemId && parentOrderId) {
      const parentItem = entities?.orderItems?.[orderItemId] ?? {
        no: 'N/A',
        price: {
          amount: 0,
          currency: order.currency,
        },
      };
      const parentOrder = entities?.orders?.[parentOrderId] ?? {};
      if (parentOrder?.id && parentOrder?.id !== order.id) {
        const batch = entities?.batches?.[batchId];
        orderIds.push(parentOrder?.id);
        orderItems.push({
          productProviderId: parentItem.productProvider.id,
          no: `[auto] ${parentItem.no}`,
          quantity: batch.latestQuantity,
          price:
            order.currency === parentOrder.currency
              ? { amount: parentItem.price.amount, currency: parentItem.price.currency }
              : { amount: 0, currency: order.currency },
          batches: [{ id: batchId }],
        });
      }
    }
  });

  const input = {
    orderItems: [...(order?.orderItems ?? []).map(({ id }) => ({ id })), ...orderItems],
  };
  return apolloClient
    .mutate({
      mutation: updateOrderMutation,
      variables: {
        id: order.id,
        input,
      },
    })
    .then(result => {
      const shipmentIds = batchIds.map(batchId => findShipmentIdByBatch(batchId, entities));
      (result.data?.batchUpdateMany ?? []).forEach(batch => {
        const shipmentId = batch?.shipment?.id;
        if (!shipmentIds.includes(shipmentId)) {
          shipmentIds.push(shipmentId);
        }
      });
      const ids = {
        orderIds: [order.id, ...orderIds].filter(Boolean),
        shipmentIds: shipmentIds.filter(Boolean),
      };
      return Promise.resolve(ids);
    });
};

export default moveBatchesToOrder;
