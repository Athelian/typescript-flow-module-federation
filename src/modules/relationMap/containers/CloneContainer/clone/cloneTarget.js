// @flow
import { differenceBy } from 'lodash';
import { getByPathWithDefault, compose, omit } from 'utils/fp';
import { cleanUpData, removeId } from 'utils/data';
import { shipmentFormQuery } from 'modules/shipment/form/query';
import { prepareCreateOrderInput } from 'modules/order/form/mutation';
import { prepareCreateShipmentInput } from 'modules/shipment/form/mutation';
import { prepareCreateBatchInput, prepareUpdateBatchInput } from 'modules/batch/form/mutation';
import {
  cloneOrderMutation,
  cloneOrderItemMutation,
  cloneBatchMutation,
  cloneShipmentMutation,
} from 'modules/relationMap/orderFocused/mutation';
import { orderListQuery } from 'modules/relationMap/orderFocused/query';
import {
  removeAdditionOrderItemFields,
  removeAdditionBatchFields,
} from 'modules/relationMap/orderFocused/formatter';
import { createMutationRequest } from './index';

export const cloneOrder = async (client: any, orders: Array<Object>, filter: Object) => {
  const mutationRequest = createMutationRequest(client);
  const orderRequests = orders.map(currentOrder => {
    const orderItems = currentOrder.orderItems.map(orderItem => {
      const batches =
        orderItem.batches &&
        orderItem.batches.map(batch => {
          const batchAdjustments = batch.batchAdjustments
            ? batch.batchAdjustments.map(adjustment =>
                omit(['sort', 'updatedBy', 'updatedAt', 'id'], adjustment)
              )
            : [];
          return {
            ...omit(['archived', 'updatedBy', 'updatedAt', 'batchedQuantity'], batch),
            batchAdjustments,
          };
        });
      return Object.assign(orderItem, { batches });
    });
    const request = mutationRequest({
      mutation: cloneOrderMutation,
      variables: {
        input: prepareCreateOrderInput(
          cleanUpData({
            ...currentOrder,
            orderItems,
            poNo: `[cloned] ${currentOrder.poNo}`,
            currency: currentOrder.currency === 'All' ? 'ALL' : currentOrder.currency,
            files: [],
          })
        ),
      },
      update: (store, { data }) => {
        const query = { query: orderListQuery, variables: filter };
        const orderList = store.readQuery(query);

        const newOrderList = Object.assign({}, orderList);
        newOrderList.orders.nodes.push(getByPathWithDefault({}, 'orderCreate.order', data));

        // @NOTE should use this way to implement maybe wait path from apollo
        // ref: https://github.com/apollographql/apollo-client/issues/2415
        // const newOrderList = update(orderList, {
        //   orders: {
        //     nodes: { $push: [getByPathWithDefault({}, 'orderCreate.order', data)] },
        //   },
        // });
        // store.writeQuery({
        //   query: orderListQuery,
        //   variables: filter,
        //   data: { data: { orders: newOrderList.orders } },
        // });
      },
    });
    return request;
  });
  const newOrders: Array<Object> = await Promise.all(orderRequests);
  const orderResults: Array<Object> = newOrders.map(newOrder => {
    const result = getByPathWithDefault({}, 'data.orderCreate.order', newOrder);
    return Object.assign(result, { actionType: 'clone' });
  });
  const orderFocus = orderResults.reduce(
    (focus, orderResult) =>
      Object.assign(focus, {
        [orderResult.id]: orderResult,
      }),
    {}
  );
  return [orderResults, orderFocus];
};

export const cloneOrderItem = async (client: any, target: Object, filter: Object) => {
  const { orderItems, batch: targetedBatch } = target;
  const mutationRequest = createMutationRequest(client);
  const orderUpdate = orderItems.reduce((orderUpdateObj, currentOrderItem) => {
    const orderId = getByPathWithDefault('', 'order.id', currentOrderItem);
    const oldBatches = currentOrderItem.batches.map(batch => ({ id: batch.id }));
    const newBatches = currentOrderItem.batches
      .filter(batch => targetedBatch && !!targetedBatch[batch.id])
      .map(
        compose(
          prepareUpdateBatchInput,
          cleanUpData,
          removeAdditionBatchFields
        )
      );
    const batches = oldBatches.concat(newBatches);
    return Object.assign(orderUpdateObj, {
      [orderId]: [
        ...(!orderUpdateObj[orderId]
          ? getByPathWithDefault([], 'order.orderItems', currentOrderItem).map(currentItem => ({
              id: currentItem.id,
            }))
          : orderUpdateObj[orderId]),
        {
          quantity: currentOrderItem.quantity,
          productProviderId:
            currentOrderItem.productProvider && currentOrderItem.productProvider.id,
          price: {
            amount: getByPathWithDefault(0, 'price.amount', currentOrderItem),
            currency: getByPathWithDefault('All', 'price.currency', currentOrderItem),
          },
          batches,
        },
      ],
    });
  }, {});
  const orderUpdateIds = Object.keys(orderUpdate);
  const orderItemRequests = orderUpdateIds.map(updateId => {
    const updateOrderItems = orderUpdate[updateId];
    const request = mutationRequest({
      mutation: cloneOrderItemMutation,
      variables: {
        id: updateId,
        input: { orderItems: updateOrderItems },
      },
      update: (store, { data }) => {
        const query = { query: orderListQuery, variables: filter };
        const orderList = store.readQuery(query);
        const updateData = data.orderUpdate.order;
        orderList.orders.nodes.forEach((order, orderIndex) => {
          if (order.id === updateData.id) {
            orderList.orders.nodes[orderIndex] = updateData;
          }
        });
      },
    });
    return request;
  });
  const updatedOrderItems = await Promise.all(orderItemRequests);
  const orderItemResult = updatedOrderItems.reduce((resultOrderItemObj, updatedOrderItem) => {
    const updatedOrderId = getByPathWithDefault('', 'data.orderUpdate.order.id', updatedOrderItem);
    const newOrderItems = getByPathWithDefault(
      [],
      'data.orderUpdate.order.orderItems',
      updatedOrderItem
    );
    const oldOrderItems = orderUpdate[updatedOrderId];
    const diffOrderItems = differenceBy(newOrderItems, oldOrderItems, 'id');
    const results = diffOrderItems.map(diffItem =>
      Object.assign(diffItem, { actionType: 'clone' })
    );
    return Object.assign(resultOrderItemObj, { [updatedOrderId]: results });
  }, {});

  const orderItemFocus = updatedOrderItems.reduce((resultOrderItemObj, updatedOrderItem) => {
    const updatedOrderId = getByPathWithDefault('', 'data.orderUpdate.order.id', updatedOrderItem);
    const newOrderItems = getByPathWithDefault(
      [],
      'data.orderUpdate.order.orderItems',
      updatedOrderItem
    );
    const oldOrderItems = orderUpdate[updatedOrderId];
    const diffOrderItems = differenceBy(newOrderItems, oldOrderItems, 'id');
    const focusedOrderItem = diffOrderItems.reduce(
      (obj, newOrderItem) => Object.assign(obj, { [newOrderItem.id]: newOrderItem }),
      {}
    );
    return Object.assign(resultOrderItemObj, focusedOrderItem);
  }, {});
  return [orderItemResult, orderItemFocus];
};

export const cloneBatchByUpdateOrder = async (client: any, batches: Object, filter: Object) => {
  const mutationRequest = createMutationRequest(client);
  const orderItems = batches.reduce(
    (result, batch) =>
      Object.assign(result, {
        [batch.orderItemId]: {
          ...result[batch.orderItemId],
          [batch.id]: { no: `[cloned] ${batch.no}`, quantity: batch.quantity },
        },
      }),
    {}
  );
  const orders = batches.reduce((result, batch) => {
    const order = getByPathWithDefault({}, 'orderItem.order', batch);
    const sameOrderItem = order.orderItems.some(orderItem => orderItem.id === batch.orderItemId);
    if (sameOrderItem) {
      return Object.assign(result, {
        [order.id]: {
          ...order,
          itemObj: order.orderItems.reduce(
            (itemObj, item) =>
              Object.assign(itemObj, {
                [item.id]: item,
              }),
            {}
          ),
        },
      });
    }
    return result;
  }, {});
  const batchRequests = Object.keys(orders).map(orderId => {
    const order = orders[orderId];
    const updateOrderItems = order.orderItems.map(orderItem => {
      if (orderItems[orderItem.id]) {
        const newBatches = (Object.entries(orderItems[orderItem.id]): any).map(newBatch => {
          const [, batch] = newBatch;
          return batch;
        });
        return {
          id: orderItem.id,
          batches: orderItem.batches.map(batch => ({ id: batch.id })).concat(newBatches),
        };
      }
      return { id: orderItem.id };
    });
    const request = mutationRequest({
      mutation: cloneOrderItemMutation,
      variables: {
        id: order.id,
        input: { orderItems: updateOrderItems },
      },
      update: (store, { data }) => {
        const query = { query: orderListQuery, variables: filter };
        const orderList = store.readQuery(query);
        const updateData = data.orderUpdate.order;
        orderList.orders.nodes.forEach((currentOrder, orderIndex) => {
          if (currentOrder.id === updateData.id) {
            orderList.orders.nodes[orderIndex] = updateData;
          }
        });
      },
    });
    return request;
  });
  const updatedBatches = await Promise.all(batchRequests);
  const batchesFocus = {};
  updatedBatches.forEach(updatedData => {
    const order = getByPathWithDefault({}, 'data.orderUpdate.order', updatedData);
    order.orderItems.forEach(orderItem => {
      const newBatches = orderItem.batches;
      const oldBatches = getByPathWithDefault(
        {},
        `${order.id}.itemObj.${orderItem.id}.batches`,
        orders
      );
      if (oldBatches) {
        const diffBatches = differenceBy(newBatches, oldBatches, 'id');
        diffBatches.forEach(batch => {
          batchesFocus[batch.id] = true;
        });
      }
    });
  });
  return [{}, batchesFocus];
};

export const cloneBatch = async (client: any, batches: Object) => {
  const mutationRequest = createMutationRequest(client);
  const batchRequests = batches.map(currentBatch => {
    const orderItemId = getByPathWithDefault('', 'orderItem.id', currentBatch);
    const inputBatch = compose(
      cleanUpData,
      batch => {
        const batchAdjustments =
          batch.batchAdjustments &&
          batch.batchAdjustments.map(batchAdjustment =>
            omit(['updatedBy', 'id', 'sort'], batchAdjustment)
          );
        return Object.assign(batch, { batchAdjustments });
      },
      omit(['archived', 'updatedBy', 'updatedAt', 'batchedQuantity']),
      removeAdditionBatchFields
    )(currentBatch);
    const request = mutationRequest(
      {
        mutation: cloneBatchMutation,
        variables: {
          input: prepareCreateBatchInput({
            ...inputBatch,
            orderItemId,
            no: `[cloned] ${currentBatch.no}`,
          }),
        },
      },
      orderItemId
    );
    return request;
  });
  const newBatches = await Promise.all(batchRequests);
  const batchResult = newBatches.reduce((batchResultObj, newBatch) => {
    const { refId } = newBatch;
    const newBatchData = getByPathWithDefault('', 'data.batchCreate.batch', newBatch);
    const batchRef = refId
      ? { [refId]: [...(batchResultObj[refId] || []), { ...newBatchData, actionType: 'clone' }] }
      : {};

    return Object.assign(batchResultObj, batchRef);
  }, {});
  const batchFocus = newBatches.reduce((batchResultObj, newBatch) => {
    const newBatchData = getByPathWithDefault('', 'data.batchCreate.batch', newBatch);
    const { id: batchId } = newBatchData;
    return Object.assign(batchResultObj, { [batchId]: newBatchData });
  }, {});
  return [batchResult, batchFocus];
};

export const cloneShipment = async (client: any, shipmentIds: Array<string>) => {
  const shipmentRequests = shipmentIds.map(shipmentId =>
    client
      .query({
        query: shipmentFormQuery,
        variables: {
          id: shipmentId,
        },
        onError: err => {
          throw err;
        },
      })
      .then(({ data }) => {
        const currentShipment = getByPathWithDefault({}, 'shipment', data);

        return client.mutate({
          mutation: cloneShipmentMutation,
          variables: {
            input: prepareCreateShipmentInput(
              cleanUpData({
                ...currentShipment,
                no: `[cloned] ${currentShipment.no}`,
                containerGroups: removeId(currentShipment.containerGroups),
                voyages: removeId(currentShipment.voyages),
                files: [],
              })
            ),
          },
          onError: err => {
            throw err;
          },
        });
      })
  );

  const newShipments = await Promise.all(shipmentRequests);
  const shipmentResults: Array<Object> = newShipments.map(newShipment => {
    const result = getByPathWithDefault({}, 'data.shipmentCreate.shipment', newShipment);
    return Object.assign(result, { actionType: 'clone', isNew: 'clone' });
  });
  const shipmentFocus = shipmentResults.reduce(
    (focus, shipmentResult) =>
      Object.assign(focus, {
        [shipmentResult.id]: shipmentResult,
      }),
    {}
  );
  return [shipmentResults, shipmentFocus];
};

const filterTargetedOrder = (target: Object) => {
  const orders: any = (Object.entries(target.order || {}): any).map((data: any) => {
    const [, orderObj] = data;
    const orderItems = orderObj.orderItems
      .filter(orderItem => target.orderItem && target.orderItem[orderItem.id])
      .map(orderItem => {
        const batches = orderItem.batches
          .filter(batch => target.batch[batch.id])
          .map(batch => removeAdditionBatchFields(batch));
        return { ...removeAdditionOrderItemFields(orderItem), batches };
      });
    return {
      ...orderObj,
      orderItems,
    };
  });
  return orders;
};

const filterTargetedOrderItem = (target: Object) => {
  const orderItems: any = (Object.entries(target.orderItem || {}): any)
    .filter(data => {
      const [, orderItem] = data;
      return !(target.order || {})[orderItem.parentId || orderItem.orderId];
    })
    .map(data => {
      const [, orderItem] = data;
      return { ...orderItem };
    });
  return orderItems;
};

const filterTargetedBatch = (target: Object) => {
  const batches: any = (Object.entries(target.batch || {}): any)
    .filter(data => {
      const [, batch] = data;
      const isTargetParentItem =
        target.orderItem && target.orderItem[batch.parentId || batch.orderItemId];
      const isTargetRootItem = target.order && target.order[batch.rootId || batch.orderId];
      return !(isTargetParentItem || isTargetRootItem);
    })
    .map(data => {
      const [, batch] = data;
      return { ...batch };
    });
  return batches;
};

export const cloneTarget = async ({
  client,
  target,
  filter,
}: {
  client: any,
  target: Object,
  filter: Object,
}) => {
  const targetedOrder = filterTargetedOrder(target);
  const targetedOrderItem = filterTargetedOrderItem(target);
  const targetedBatch = filterTargetedBatch(target);
  // TODO: should run in parallel
  const [orderResults, orderFocus] = await cloneOrder(client, targetedOrder, filter);
  const [shipmentResults, shipmentFocus] = await cloneShipment(
    client,
    Object.keys(target.shipment || {})
  );
  const [orderItemResult, orderItemFocus] = await cloneOrderItem(
    client,
    { orderItems: targetedOrderItem, batch: target.batch },
    filter
  );
  const [batchResult, batchFocus] = await cloneBatch(client, targetedBatch);

  const result = {
    order: orderResults,
    orderItem: orderItemResult,
    batch: batchResult,
    shipment: shipmentResults,
  };
  const focus = {
    order: orderFocus,
    orderItem: orderItemFocus,
    batch: batchFocus,
    shipment: shipmentFocus,
  };
  return [result, focus];
};
