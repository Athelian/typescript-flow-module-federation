// @flow
import apolloClient from 'apollo';
import { findOrderIdByItem } from 'modules/relationMapV2/helpers';
import { updateOrderMutation } from 'modules/order/form/mutation';

export const moveOrderItemsToOrder = ({
  itemIds,
  order,
  entities,
}: {
  itemIds: Array<string>,
  order: Object,
  entities: Object,
}) => {
  const orderItems = [];
  const orderIds = [];
  itemIds.forEach(orderItemId => {
    orderItems.push({
      id: orderItemId,
    });
    const orderId = findOrderIdByItem({
      viewer: 'Order',
      orderItemId,
      entities,
    });
    orderIds.push(orderId);
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

export default moveOrderItemsToOrder;
