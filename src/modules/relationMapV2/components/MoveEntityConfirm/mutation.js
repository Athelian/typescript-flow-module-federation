// @flow
import apolloClient from 'apollo';
import { getByPathWithDefault } from 'utils/fp';
import { updateOrderMutation } from 'modules/order/form/mutation';
import { updateOrderItemMutation } from 'modules/orderItem/form/mutation';
import { updateBatchMutation } from 'modules/batch/form/mutation';
import {
  findShipmentIdsByOrder,
  findParentIdsByBatch,
  findOrderIdByItem,
  findOrderIdsByContainer,
  findOrderIdsByShipment,
} from 'modules/relationMapV2/helpers';
import { ORDER, SHIPMENT } from 'modules/relationMapV2/constants';
import type { State } from 'modules/relationMapV2/type.js.flow';

const moveBatchToOrder = ({
  batch,
  order,
  entities,
  isOrderFocus,
}: {
  batch: Object,
  order: Object,
  entities: Object,
  isOrderFocus: boolean,
}) => {
  const [orderItemId, parentOrderId] = findParentIdsByBatch({
    entities,
    batchId: batch.id,
    viewer: isOrderFocus ? ORDER : SHIPMENT,
  });

  if (!orderItemId) return Promise.reject(new Error('Not found order item'));
  if (!parentOrderId || !order) return Promise.reject(new Error('Not found order'));

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
    .then(() => {
      if (isOrderFocus) {
        return Promise.resolve([order.id, parentOrderId].filter(Boolean));
      }

      return Promise.resolve(
        [order.id, parentOrderId].filter(Boolean).map(id => findShipmentIdsByOrder(id, entities))
      );
    });
};

const moveOrderItemToOrder = ({
  orderItemId,
  orderId,
  entities,
  isOrderFocus,
}: {
  orderItemId: string,
  orderId: string,
  entities: Object,
  isOrderFocus: boolean,
}) => {
  const parentOrderId = findOrderIdByItem({
    entities,
    orderItemId,
    viewer: isOrderFocus ? ORDER : SHIPMENT,
  });

  return apolloClient
    .mutate({
      mutation: updateOrderItemMutation,
      variables: {
        id: orderItemId,
        input: {
          orderId,
        },
      },
    })
    .then(() => {
      if (isOrderFocus) {
        return Promise.resolve([orderId, parentOrderId].filter(Boolean));
      }

      return Promise.resolve(
        [orderId, parentOrderId].filter(Boolean).flatMap(id => findShipmentIdsByOrder(id, entities))
      );
    });
};

const moveOrderItemsToOrder = ({
  itemIds,
  orderId,
  entities,
  isOrderFocus,
}: {
  itemIds: Array<string>,
  orderId: string,
  entities: Object,
  isOrderFocus: boolean,
}) => {
  return Promise.all(
    itemIds.map(orderItemId =>
      moveOrderItemToOrder({
        orderItemId,
        orderId,
        entities,
        isOrderFocus,
      })
    )
    // $FlowIgnore: flow doesn't support flat yet
  ).then(ids => (ids ?? []).flat());
};

const moveBatchToOrderItem = ({
  batchId,
  orderItemId,
  entities,
  isOrderFocus,
}: {
  batchId: string,
  orderItemId: string,
  entities: Object,
  isOrderFocus: boolean,
}) => {
  const [, parentOrderId] = findParentIdsByBatch({
    entities,
    batchId,
    viewer: isOrderFocus ? ORDER : SHIPMENT,
  });

  const orderId = findOrderIdByItem({
    entities,
    orderItemId,
    viewer: isOrderFocus ? ORDER : SHIPMENT,
  });

  return apolloClient
    .mutate({
      mutation: updateBatchMutation,
      variables: {
        id: batchId,
        input: {
          orderItemId,
        },
      },
    })
    .then(() => {
      if (isOrderFocus) {
        return Promise.resolve([orderId, parentOrderId].filter(Boolean));
      }

      return Promise.resolve(
        [orderId, parentOrderId].filter(Boolean).flatMap(id => findShipmentIdsByOrder(id, entities))
      );
    });
};

const moveBatchToContainer = ({
  batchId,
  containerId,
  entities,
  isOrderFocus,
}: {
  batchId: string,
  containerId: string,
  entities: Object,
  isOrderFocus: boolean,
}) => {
  const container = getByPathWithDefault({}, `containers.${containerId}`, entities);
  const [, parentOrderId] = findParentIdsByBatch({
    entities,
    batchId,
    viewer: isOrderFocus ? ORDER : SHIPMENT,
  });
  const orderIds = findOrderIdsByContainer({
    entities,
    containerId,
    viewer: isOrderFocus ? ORDER : SHIPMENT,
  });

  return apolloClient
    .mutate({
      mutation: updateBatchMutation,
      variables: {
        id: batchId,
        input: {
          containerId,
          shipmentId: container.shipment,
        },
      },
    })
    .then(() => {
      if (isOrderFocus) {
        return Promise.resolve([...orderIds, parentOrderId].filter(Boolean));
      }

      return Promise.resolve([
        ...(parentOrderId ? findShipmentIdsByOrder(parentOrderId, entities) : []),
        container.shipment,
      ]);
    });
};

const moveBatchToShipment = ({
  batchId,
  shipmentId,
  entities,
  isOrderFocus,
}: {|
  batchId: string,
  shipmentId: string,
  entities: Object,
  isOrderFocus: boolean,
|}) => {
  const [, parentOrderId] = findParentIdsByBatch({
    entities,
    batchId,
    viewer: isOrderFocus ? ORDER : SHIPMENT,
  });
  const orderIds = findOrderIdsByShipment({
    entities,
    shipmentId,
    viewer: isOrderFocus ? ORDER : SHIPMENT,
  });
  return apolloClient
    .mutate({
      mutation: updateBatchMutation,
      variables: {
        id: batchId,
        input: {
          shipmentId,
          containerId: null,
        },
      },
    })
    .then(() => {
      if (isOrderFocus) {
        return Promise.resolve([...orderIds, parentOrderId].filter(Boolean));
      }

      return Promise.resolve([
        ...(parentOrderId ? findShipmentIdsByOrder(parentOrderId, entities) : []),
        shipmentId,
      ]);
    });
};

const moveBatchesToShipment = ({
  batchIds,
  shipmentId,
  entities,
  isOrderFocus,
}: {|
  batchIds: Array<string>,
  shipmentId: string,
  entities: Object,
  isOrderFocus: boolean,
|}) => {
  return Promise.all(
    batchIds.map(batchId =>
      moveBatchToShipment({
        batchId,
        shipmentId,
        entities,
        isOrderFocus,
      })
    )
    // $FlowIgnore: flow doesn't support flat yet
  ).then(ids => (ids ?? []).flat());
};

const moveBatchesToContainer = ({
  batchIds,
  containerId,
  entities,
  isOrderFocus,
}: {|
  batchIds: Array<string>,
  containerId: string,
  entities: Object,
  isOrderFocus: boolean,
|}) => {
  return Promise.all(
    batchIds.map(batchId =>
      moveBatchToContainer({
        batchId,
        containerId,
        entities,
        isOrderFocus,
      })
    )
    // $FlowIgnore: flow doesn't support flat yet
  ).then(ids => (ids ?? []).flat());
};

export const moveEntityMutation = (state: State, entities: Object) => {
  const isOrderFocus = state.viewer === 'Order';
  switch (state.moveEntity.detail.from.icon) {
    case 'ORDER_ITEM': {
      return moveOrderItemToOrder({
        entities,
        isOrderFocus,
        orderItemId: state.moveEntity.detail.from.id,
        orderId: state.moveEntity.detail.to.id,
      });
    }
    case 'ORDER_ITEMS': {
      const itemIds = state.moveEntity.detail.from.id.split(',') ?? [];
      switch (state.moveEntity.detail.to.icon) {
        case 'ORDER': {
          return moveOrderItemsToOrder({
            entities,
            isOrderFocus,
            itemIds,
            orderId: state.moveEntity.detail.to.id,
          });
        }

        default:
          return Promise.reject(new Error(`Not handle yet`));
      }
    }
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
            isOrderFocus,
          });
        }

        case 'ORDER_ITEM': {
          return moveBatchToOrderItem({
            entities,
            isOrderFocus,
            batchId: state.moveEntity.detail.from.id,
            orderItemId: state.moveEntity.detail.to.id,
          });
        }

        case 'CONTAINER': {
          return moveBatchToContainer({
            entities,
            isOrderFocus,
            containerId: state.moveEntity.detail.to.id,
            batchId: state.moveEntity.detail.from.id,
          });
        }

        case 'SHIPMENT': {
          return moveBatchToShipment({
            entities,
            isOrderFocus,
            shipmentId: state.moveEntity.detail.to.id,
            batchId: state.moveEntity.detail.from.id,
          });
        }

        default:
          return Promise.reject(new Error(`Not handle yet`));
      }
    }

    case 'BATCHES': {
      const batchIds = state.moveEntity.detail.from.id.split(',') ?? [];
      switch (state.moveEntity.detail.to.icon) {
        case 'CONTAINER': {
          return moveBatchesToContainer({
            entities,
            isOrderFocus,
            batchIds,
            containerId: state.moveEntity.detail.to.id,
          });
        }
        case 'SHIPMENT': {
          return moveBatchesToShipment({
            entities,
            isOrderFocus,
            batchIds,
            shipmentId: state.moveEntity.detail.to.id,
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
