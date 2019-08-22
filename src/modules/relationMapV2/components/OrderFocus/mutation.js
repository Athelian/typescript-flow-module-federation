// @flow
import apolloClient from 'apollo';
import { findKey } from 'lodash';
import { getByPathWithDefault } from 'utils/fp';
import { updateOrderMutation } from 'modules/order/form/mutation';
import type { State } from './type.js.flow';

const moveBatchToOrder = ({
  batch,
  order,
  entities,
}: {
  batch: Object,
  order: Object,
  entities: Object,
}) => {
  const orderItemId = findKey(entities.orderItems, orderItem => {
    return (orderItem.batches || []).includes(batch.id);
  });

  if (!orderItemId) return Promise.reject(new Error(`Not found order item`));

  const parentOrderId = findKey(entities.orders, currentOrder => {
    return (currentOrder.orderItems || []).includes(orderItemId);
  });

  if (!parentOrderId) return Promise.reject(new Error(`Not found order`));

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
  return apolloClient
    .mutate({
      mutation: updateOrderMutation,
      variables: {
        id: order.id,
        input: {
          orderItems: [
            ...(order.orderItems || []).map(itemId => ({ id: itemId })),
            {
              productProviderId: parentItem.productProvider.id,
              no: `[auto] ${parentItem.no}`,
              quantity: batch.latestQuantity,
              price:
                order.currency === parentOrder.currency
                  ? { amount: parentItem.price.amount, currency: parentItem.price.currency }
                  : { amount: 0, currency: order.currency },
              batches: [{ id: batch.id }],
            },
          ],
        },
      },
    })
    .then(() =>
      Promise.resolve({
        orderIds: [order.id, parentOrderId],
      })
    );
};

export const moveEntityMutation = (state: State, entities: Object) => {
  switch (state.moveEntity.detail.from.icon) {
    case 'BATCH': {
      const batch = getByPathWithDefault(
        null,
        `batches.${state.moveEntity.detail.from.id}`,
        entities
      );

      switch (state.moveEntity.detail.to.icon) {
        case 'ORDER': {
          const order = getByPathWithDefault(
            null,
            `orders.${state.moveEntity.detail.to.id}`,
            entities
          );
          return moveBatchToOrder({
            batch,
            order,
            entities,
          });
        }

        default:
          return Promise.reject(new Error(`Not handle yet`));
      }
    }

    default:
      return Promise.reject(new Error(`Not handle yet`));
  }
};

export default moveEntityMutation;
