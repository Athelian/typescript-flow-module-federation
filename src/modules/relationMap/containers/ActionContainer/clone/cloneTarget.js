import { differenceBy } from 'lodash';
import { getByPathWithDefault } from 'utils/fp';
import { createBatchMutation } from 'modules/batch/form/mutation';
import { createShipmentWithReturnDataMutation } from 'modules/shipment/form/mutation';
import { createOrderMutation, updateOrderItemMutation } from 'modules/order/form/mutation';
import { createMutationRequest, formatResult } from './index';

export const cloneOrder = async (client, order) => {
  const mutationRequest = createMutationRequest(client);
  const orderIds = Object.keys(order);
  const orderRequests = orderIds.map(orderId => {
    const currentOrder = order[orderId];
    const request = mutationRequest({
      mutation: createOrderMutation,
      variables: {
        input: {
          poNo: `[cloned] ${currentOrder.poNo}`,
          exporterId: currentOrder.exporter && currentOrder.exporter.id,
          currency: currentOrder.currency,
        },
      },
    });
    return request;
  });
  const newOrders = await Promise.all(orderRequests);
  const orderResults = newOrders.map(newOrder =>
    getByPathWithDefault({}, 'data.orderCreate.order', newOrder)
  );
  const orderFocus = orderResults.reduce(
    (focus, orderResult) =>
      Object.assign(focus, {
        [orderResult.id]: true,
      }),
    {}
  );
  return [orderResults, orderFocus];
};

export const cloneOrderItem = async (client, orderItem) => {
  const mutationRequest = createMutationRequest(client);
  const orderItemIds = Object.keys(orderItem);
  const orderUpdate = orderItemIds.reduce((orderUpdateObj, orderItemId) => {
    const currentOrderItem = orderItem[orderItemId];
    const orderId = getByPathWithDefault('', 'order.id', currentOrderItem);
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
        },
      ],
    });
  }, {});
  const orderUpdateIds = Object.keys(orderUpdate);
  const orderItemRequests = orderUpdateIds.map(updateId => {
    const updateOrderItems = orderUpdate[updateId];
    const request = mutationRequest({
      mutation: updateOrderItemMutation,
      variables: {
        id: updateId,
        input: { orderItems: updateOrderItems },
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
    return Object.assign(resultOrderItemObj, { [updatedOrderId]: diffOrderItems });
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
      (obj, newOrderItem) => Object.assign(obj, { [newOrderItem.id]: true }),
      {}
    );
    return Object.assign(resultOrderItemObj, focusedOrderItem);
  }, {});
  return [orderItemResult, orderItemFocus];
};

export const cloneBatch = async (client, batch) => {
  const mutationRequest = createMutationRequest(client);
  const batchIds = Object.keys(batch);
  const batchRequests = batchIds.map(batchId => {
    const currentBatch = batch[batchId];
    const request = mutationRequest(
      {
        mutation: createBatchMutation,
        variables: {
          input: {
            no: `[cloned] ${currentBatch.no}`,
            quantity: currentBatch.quantity,
            orderItemId: currentBatch.orderItem && currentBatch.orderItem.id,
          },
        },
      },
      batchId
    );
    return request;
  });
  const newBatches = await Promise.all(batchRequests);
  const batchResult = formatResult(newBatches, 'batchCreate.batch.id', batchIds);
  return [batchResult, batchResult.itemId];
};

export const cloneShipment = async (client, shipment) => {
  const shipmentIds = Object.keys(shipment);
  const shipmentRequests = shipmentIds.map(shipmentId => {
    const currentShipment = shipment[shipmentId];
    const request = client.mutate({
      mutation: createShipmentWithReturnDataMutation,
      variables: {
        input: {
          no: `[cloned] ${currentShipment.no}`,
          containerGroups: currentShipment.containerGroups.map(group => ({
            warehouseId: getByPathWithDefault('1', 'warehouse.id', group),
          })),
          voyages: currentShipment.voyages.map(voyage => ({ vesselName: voyage.vesselName })),
        },
      },
    });
    return request;
  });
  const newShipments = await Promise.all(shipmentRequests);
  const shipmentResults = newShipments.map(newShipment =>
    getByPathWithDefault({}, 'data.shipmentCreate.shipment', newShipment)
  );
  const shipmentFocus = shipmentResults.reduce(
    (focus, shipmentResult) =>
      Object.assign(focus, {
        [shipmentResult.id]: true,
      }),
    {}
  );
  return [shipmentResults, shipmentFocus];
};
