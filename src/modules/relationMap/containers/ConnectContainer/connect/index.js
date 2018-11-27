// @flow
import { createShipmentWithReturnDataMutation } from 'modules/shipment/form/mutation';
import { updateBatchMutation } from 'modules/batch/form/mutation';
import { cloneOrderItemMutation as updateOrderMutation } from 'modules/relationMap/orderFocused/mutation';
import { getByPathWithDefault as get, compose } from 'utils/fp';
import { uniqBy, map, filter } from 'lodash/fp';

const connectShipmentInBatch = (client: any, batch: Object, shipmentId: ?string) => {
  const batchIds = Object.keys(batch);
  const requests = batchIds.map(batchId => {
    const request = client.mutate({
      mutation: updateBatchMutation,
      variables: {
        id: batchId,
        input: {
          shipmentId,
        },
      },
    });
    return request;
  });
  return requests;
};

export const connectNewShipment = async (client: any, target: Object) => {
  const { data } = await client.mutate({
    mutation: createShipmentWithReturnDataMutation,
    variables: {
      input: {
        no: `[new] shipment ${Math.random().toPrecision(4)}`,
        containerGroups: [{ warehouseId: '1' }],
        voyages: [{ vesselName: 'new vessel name' }],
      },
    },
  });
  const newShipment = get('', 'shipmentCreate.shipment', data);
  await Promise.all(connectShipmentInBatch(client, target.batch || {}, newShipment.id));
  const result = {
    order: [],
    shipment: [newShipment],
    orderItem: {},
    batch: {},
  };
  const focus = {
    ...target,
    shipment: {
      [newShipment.id]: true,
    },
  };
  return [result, focus];
};

export const connectExistingShipment = async (client: any, target: Object) => {
  const shipmentIds = Object.keys(target.shipment || {});
  const connectedShipmentId = shipmentIds.length > 0 ? shipmentIds[0] : '';
  await Promise.all(connectShipmentInBatch(client, target.batch || {}, connectedShipmentId));
  return target;
};

export const disconnectShipment = async (client: any, target: Object) => {
  await Promise.all(connectShipmentInBatch(client, target.batch || {}, null));
  return target;
};

export const deleteItem = async (client: any, target: Object) => {
  const { batch, orderItem } = target;
  const batchIds = Object.keys(batch || {});
  const orderItemIds = Object.keys(orderItem || {});

  const orderItemObj = batchIds
    .filter(batchId => {
      const orderItemId = get(false, 'orderItem.id', batch[batchId]);
      return !orderItem[orderItemId];
    })
    .reduce((obj, batchId) => {
      const currentOrderItem = get(false, 'orderItem', batch[batchId]);
      const currentBatches =
        get(false, `${currentOrderItem.id}.batches`, obj) || currentOrderItem.batches;
      const batchesInput = currentBatches.filter(currentBatch => !batch[currentBatch.id]);
      return Object.assign(obj, {
        [currentOrderItem.id]: {
          ...currentOrderItem,
          batches: batchesInput,
        },
      });
    }, {});

  const removeBatchRequests = compose(
    map(order => {
      const orderItems =
        order.orderItems &&
        order.orderItems.map(({ id: itemId }) => orderItemObj[itemId] || { id: itemId });
      return client.mutate({
        mutation: updateOrderMutation,
        variables: {
          id: order.id,
          input: { orderItems },
        },
      });
    }),
    uniqBy('id'),
    filter(order => !!order),
    map(batchId => get(null, 'orderItem.order', batch[batchId]))
  )(batchIds);

  const removeItemRequests = compose(
    map(order => {
      const orderItems = order.orderItems.filter(({ id: itemId }) => !orderItem[itemId]);
      return client.mutate({
        mutation: updateOrderMutation,
        variables: {
          id: order.id,
          input: { orderItems },
        },
      });
    }),
    uniqBy('id'),
    filter(order => !!order),
    map(orderItemId => get(null, `${orderItemId}.order`, orderItem))
  )(orderItemIds);
  await Promise.all([...removeBatchRequests, ...removeItemRequests]);
  return target;
};
