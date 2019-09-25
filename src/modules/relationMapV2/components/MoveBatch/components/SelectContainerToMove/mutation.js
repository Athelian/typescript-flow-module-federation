// @flow
import apolloClient from 'apollo';
import { findKey } from 'lodash';
import { getByPathWithDefault } from 'utils/fp';
import { updateOrderMutation } from 'modules/order/form/mutation';

export const moveBatchesToOrder = ({
  batchIds,
  order,
  entities,
}: {
  batchIds: Array<string>,
  order: Object,
  entities: Object,
}) => {
  const orderItems = [];
  const orderIds = [];
  batchIds.forEach(batchId => {
    const orderItemId = findKey(entities.orderItems, orderItem => {
      return (orderItem.batches || []).includes(batchId);
    });
    const parentOrderId = findKey(entities.orders, currentOrder => {
      return (currentOrder.orderItems || []).includes(orderItemId);
    });
    if (orderItemId && parentOrderId) {
      const parentItem = getByPathWithDefault(
        {
          no: 'N/A',
          price: {
            amount: 0,
            currency: order.currency,
          },
        },
        `orderItems.${orderItemId}`,
        entities
      );
      const parentOrder = getByPathWithDefault({}, `orders.${parentOrderId}`, entities);
      if (parentOrder?.id && parentOrder?.id !== order.id) {
        const batch = getByPathWithDefault({}, `batches.${batchId}`, entities);
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

  return apolloClient
    .mutate({
      mutation: updateOrderMutation,
      variables: {
        id: order.id,
        input: {
          orderItems: [...(order.orderItems || []).map(({ id }) => ({ id })), ...orderItems],
        },
      },
    })
    .then(() => Promise.resolve([order.id, ...orderIds]));
};

export default moveBatchesToOrder;
