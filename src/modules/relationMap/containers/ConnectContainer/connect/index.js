// @flow
import { createShipmentWithReturnDataMutation } from 'modules/shipment/form/mutation';
import {
  cloneOrderItemMutation as updateOrderMutation,
  updateBatchWithReturnDataMutation,
} from 'modules/relationMap/orderFocused/mutation';
import {
  removeAdditionBatchFields,
  removeAdditionOrderItemFields,
} from 'modules/relationMap/orderFocused/formatter';
// import { orderListQuery } from 'modules/relationMap/orderFocused/query';
import { getExportId } from 'modules/relationMap/common/ActionPanel/util';
import { getByPathWithDefault as get, compose, omit } from 'utils/fp';
import { cleanUpData } from 'utils/data';
import { uniqBy, map, filter } from 'lodash/fp';

const cleanOrderItem = compose(
  removeAdditionOrderItemFields,
  cleanUpData
);
const cleanBatch = compose(
  cleanUpData,
  batch => {
    const batchAdjustments =
      batch.batchAdjustments &&
      batch.batchAdjustments.map(batchAdjustment =>
        omit(['updatedBy', 'id', 'sort'], batchAdjustment)
      );
    return Object.assign(batch, { batchAdjustments });
  },
  omit([
    'archived',
    'updatedBy',
    'updatedAt',
    'batchedQuantity',
    'orderItem',
    'customFields',
    'tags',
  ]),
  removeAdditionBatchFields
);

const connectShipmentInBatch = (client: any, batch: Object, shipmentId: ?string) => {
  const batchIds = Object.keys(batch);
  const requests = batchIds.map(batchId => {
    const request = client.mutate({
      mutation: updateBatchWithReturnDataMutation,
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

export const connectExistingShipment = async (
  client: any,
  target: Object,
  selectedItem: Object
) => {
  const connectedShipmentId = selectedItem.id;
  await Promise.all(connectShipmentInBatch(client, target.batch || {}, connectedShipmentId));
  return target;
};

export const connectExistingOrder = async (client: any, target: Object, selectedItem: Object) => {
  const { orderItem: targetItem, batch: targetBatch } = target;
  const exportId = get(null, 'exporter.id', selectedItem);
  const itemFromBatches = (Object.entries(targetBatch): Array<any>).map(data => {
    const [, item] = data;
    const price = cleanUpData(get(0, 'orderItem.price', item));
    const productProviderId = get('', 'orderItem.productProvider.id', item);
    const quantity =
      get(0, 'orderItem.quantity', item) +
      item.batchAdjustments.reduce((total, adjustment) => total + adjustment.quantity, 0);
    const batch = cleanBatch(item);
    return {
      price,
      quantity,
      productProviderId,
      batches: [batch],
    };
  });
  const items = (Object.entries(targetItem): Array<any>).map(data => {
    const [, item] = data;
    const batches = item.batches.filter(batch => targetBatch[batch.id]).map(cleanBatch);
    return {
      ...cleanOrderItem(item),
      batches,
    };
  });
  await client.mutate({
    mutation: updateOrderMutation,
    variables: {
      id: selectedItem.id,
      input: {
        exporterId: exportId || getExportId(targetItem),
        orderItems: (selectedItem.orderItems || [])
          .map(item => ({ id: item.id }))
          .concat(itemFromBatches)
          .concat(items),
      },
    },
  });
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
      const orderItemId = get(false, 'orderItem.id', batch[batchId]);
      return Object.assign(obj, {
        [orderItemId]: true,
      });
    }, {});

  const removeBatchRequests = compose(
    map(order => {
      const orderItems =
        order.orderItems &&
        order.orderItems.map(item => {
          const { id: itemId, batches } = item;
          if (orderItemObj[itemId]) {
            return {
              id: itemId,
              batches: batches
                .filter(({ id: batchId }) => !batch[batchId])
                .map(({ id: batchId }) => ({ id: batchId })),
            };
          }
          return { id: itemId };
        });
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
