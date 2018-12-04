// @flow
import { pipe, filter, isEmpty, omit } from 'ramda';
import { initOrderObj } from 'modules/relationMap/util';

const prependArray = (arr: Array<any>) => (newArr: Array<any>) => [...arr, ...newArr];

const filterOutNewData = (newData: Array<Object>) => (data: Object) =>
  !newData ? true : !newData.some(d => d.id === data.id);

const createFilterData = (newData: Array<Object> = []) =>
  pipe(
    filter(filterOutNewData(newData || [])),
    prependArray(newData.map(d => Object.assign(d, { isNew: d.actionType || 'newItem' })))
  );
const getIsNew = (item: Object) => item.isNew || false;

export const getIsCollapsed = (result: Object, order: Object) => {
  const { newOrderItem, newBatch } = result;
  if (newOrderItem[order.id] && !isEmpty(newOrderItem[order.id])) {
    return false;
  }
  if (!order.orderItems || (order.orderItems && isEmpty(order.orderItems))) {
    return true;
  }
  const hasBatchResult = (order.orderItems || []).some(({ id: orderItemId }) => {
    if (newBatch[orderItemId] && !isEmpty(newBatch[orderItemId])) {
      return true;
    }
    return false;
  });
  return !hasBatchResult;
};

export const formatNodes = (orders: Array<Object>, result: Object) => {
  const { order: newOrder = [], orderItem: newOrderItem = {}, batch: newBatch = {} } = result;
  const filterOrder = createFilterData(newOrder);
  const nodes: Array<Object> = filterOrder(orders).map(order => {
    const filterOrderItem = createFilterData(newOrderItem[order.id]);
    const orderItems = filterOrderItem(order.orderItems || []).map(orderItem => {
      const filterBatch = createFilterData(newBatch[orderItem.id]);
      const batches = filterBatch(orderItem.batches || []).map(batch => ({
        ...batch,
        id: batch.id,
        isNew: getIsNew(batch),
      }));
      return {
        ...orderItem,
        id: orderItem.id,
        isNew: getIsNew(orderItem),
        batches,
      };
    });
    return {
      ...order,
      id: order.id,
      isNew: getIsNew(order),
      isCollapsed: getIsCollapsed({ newOrderItem, newBatch }, order),
      orderItems,
    };
  });
  return nodes;
};

export const removeAdditionBatchFields: Function = omit([
  'index',
  'rootId',
  'parentId',
  'volumeLabel',
  'metric',
  'orderId',
  'orderItemId',
  'actionType',
  'batchedQuantity',
  '__typename',
]);
export const removeAdditionOrderItemFields: Function = omit([
  'name',
  'orderedQuantity',
  'batchedQuantity',
  'shippedQuantity',
  'orderId',
  'order',
  'parentId',
  'index',
  'actionType',
  '__typename',
]);

export const removeAdditionShipmentFields: Function = omit([
  'actionType',
  'isNew',
  'totalOrder',
  'totalBatch',
]);

function* iterateOrders(orders: Array<Object>) {
  for (let orderIndex = 0; orderIndex < orders.length; orderIndex += 1) {
    const order = orders[orderIndex];
    yield { type: 'ORDER', index: orderIndex, data: order };
    const { orderItems = [], shipments = [] } = order;
    for (let shipmentIndex = 0; shipmentIndex < shipments.length; shipmentIndex += 1) {
      const shipment = shipments[shipmentIndex];
      yield { type: 'SHIPMENT', index: shipmentIndex, data: shipment };
    }
    for (let itemIndex = 0; itemIndex < orderItems.length; itemIndex += 1) {
      const orderItem = orderItems[itemIndex];
      yield { type: 'ORDER_ITEM', index: itemIndex, data: orderItem };
      const { batches = [] } = orderItem;
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
        const batch = batches[batchIndex];
        yield { type: 'BATCH', index: batchIndex, data: batch };
      }
    }
  }
}

const summary = (orders: Array<Object>) => {
  const sumOrders = orders.length;
  let sumOrderItems = 0;
  let sumBatches = 0;
  let sumShipments = 0;

  const getSummary = () => ({
    sumOrders,
    sumOrderItems,
    sumBatches,
    sumShipments,
  });

  const findSummary = (entity: Object) => {
    if (entity.type === 'ORDER') {
      const { orderItems = [], shipments = [] } = entity.data;
      sumOrderItems += orderItems.length;
      sumShipments += shipments.length;
    }
    if (entity.type === 'ORDER_ITEM') {
      const { batches = [] } = entity.data;
      sumBatches += batches.length;
    }
    return getSummary();
  };
  return {
    findSummary,
    getSummary,
  };
};

const getBatchedQuantity = (batch: Object) => {
  const { quantity, batchAdjustments = [] } = batch;
  return batchAdjustments.reduce((total, adjustment) => total + adjustment.quantity, quantity || 0);
};

export const createOrderObj = () => {
  const orderObj = {};
  let orderId = '';
  let orderItemId = '';
  let batchId = '';
  const getOrderObj = () => orderObj;
  const formatOrderObj = (entity: Object) => {
    const { type, data, index } = entity;
    const { id } = data;
    if (!orderObj[id]) {
      orderObj[id] = initOrderObj(data);
    }
    const { relation: orderRelation, data: orderData } = orderObj[orderId];
    if (type === 'ORDER') {
      orderId = id;
    }
    if (type === 'ORDER_ITEM') {
      const { batches = [] } = data;
      orderItemId = id;
      orderRelation.orderItem[orderItemId] = {
        ...data,
        parentId: orderId,
        index: orderItemId,
      };
      orderData.totalBatch += batches.length;
      orderData.orderedQuantity += data.quantity || 0;
    }
    if (type === 'BATCH') {
      const { shipment } = data;
      const batchedQuantity = getBatchedQuantity(data);
      batchId = id;
      const batchRelation = {
        ...data,
        rootId: orderId,
        parentId: orderItemId,
        index,
      };
      orderData.batchedQuantity += batchedQuantity;
      orderRelation.batch[batchId] = batchRelation;
      if (shipment) {
        orderData.shippedQuantity += batchedQuantity;
        orderRelation.shipment[shipment.id] = true;
      }
    }
  };
  return {
    formatOrderObj,
    getOrderObj,
  };
};
export const formatOrders = (orders: Array<Object>) => {
  const orderGenerator = iterateOrders(orders);
  const summaryData = summary(orders);
  let result = orderGenerator.next();
  while (!result.done) {
    summaryData.findSummary(result.value);
    result = orderGenerator.next();
  }
  return {
    ...summaryData.getSummary(),
  };
};
