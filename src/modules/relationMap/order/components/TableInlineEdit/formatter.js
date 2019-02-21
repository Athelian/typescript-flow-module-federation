// @flow
import {
  initOrderObj,
  initOrderItemObj,
  initBatchObj,
  initShipmentObj,
} from 'modules/relationMap/util';

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

const getBatchRelation = (batch: Object, info: Object) => {
  const { orderId, orderItemId, index } = info;
  return {
    ...batch,
    rootId: orderId,
    parentId: orderItemId,
    index,
  };
};

const createOrderObj = () => {
  const orderObj = {};
  let orderId = '';
  let orderItemId = '';
  let batchId = '';
  const getOrderObj = () => ({ order: orderObj });
  const formatOrderObj = (entity: Object) => {
    const { type, data, index } = entity;
    const { id } = data;
    if (type === 'ORDER') {
      if (!orderObj[id]) {
        orderObj[id] = initOrderObj(data);
      }
      orderId = id;
    }
    if (type === 'ORDER_ITEM') {
      const { batches = [] } = data;
      const { relation: orderRelation, data: orderData } = orderObj[orderId];
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
      const { relation: orderRelation } = orderObj[orderId];
      batchId = id;
      orderRelation.batch[batchId] = getBatchRelation(data, {
        orderId,
        orderItemId,
        index,
      });
      if (shipment) {
        orderRelation.shipment[shipment.id] = true;
      }
    }
  };
  return {
    formatOrderObj,
    getOrderObj,
  };
};

const createOrderItemObj = () => {
  let orderId = '';
  let order = {};
  let orderItemId = '';
  const orderItemObj = {};
  const relatedShipment = {};
  const getOrderItemObj = () => ({ orderItem: orderItemObj });
  const formatOrderItemObj = entity => {
    const { type, data, index } = entity;
    const { id } = data;
    if (type === 'ORDER') {
      orderId = id;
      order = data;
      const { shipments } = order;
      shipments.forEach(shipment => {
        const batches = shipment.batches || [];
        batches.forEach(batch => {
          relatedShipment[batch.id] = shipment;
        });
      });
    }
    if (type === 'ORDER_ITEM') {
      orderItemId = id;
      if (!orderItemObj[id]) {
        orderItemObj[id] = initOrderItemObj(data, order);
        orderItemObj[id].data.batches.forEach((batch, batchIndex) => {
          if (batch) {
            const batchData = orderItemObj[id].data.batches[batchIndex];
            batchData.shipment = relatedShipment[batch.id] || {};
          }
        });
      }
    }
    if (type === 'BATCH') {
      const { shipment } = data;
      const { relation: orderItemRelation } = orderItemObj[orderItemId];
      orderItemRelation.batch[id] = getBatchRelation(data, {
        orderId,
        orderItemId,
        index,
      });
      if (shipment) {
        orderItemRelation.shipment[shipment.id] = true;
      }
    }
  };
  return {
    formatOrderItemObj,
    getOrderItemObj,
  };
};

const createBatchObj = () => {
  let order = {};
  let orderItem = {};
  let orderId = '';
  const batchObj = {};
  const getBatchObj = () => ({ batch: batchObj });
  const formatBatchObj = entity => {
    const { type, data } = entity;
    const { id } = data;
    if (type === 'ORDER') {
      orderId = id;
      order = data;
    }
    if (type === 'ORDER_ITEM') {
      orderItem = { ...data, order };
    }
    if (type === 'BATCH') {
      if (!batchObj[id]) {
        batchObj[id] = initBatchObj(data, orderId, orderItem);
      }
    }
  };
  return {
    getBatchObj,
    formatBatchObj,
  };
};

const createShipmentObj = () => {
  const shipmentObj = {};
  let orderId = '';
  let orderItemId = '';
  const getShipmentObj = () => ({ shipment: shipmentObj });
  const formatShipmentObj = entity => {
    const { type, data } = entity;
    const { id } = data;
    if (type === 'ORDER') {
      orderId = id;
    }
    if (type === 'ORDER_ITEM') {
      orderItemId = id;
    }
    if (type === 'SHIPMENT') {
      if (!shipmentObj[id]) {
        shipmentObj[id] = initShipmentObj(data);
      }
      const { relation: shipmentRelation } = shipmentObj[id];
      shipmentRelation.order[orderId] = true;
    }
    if (type === 'BATCH') {
      const { shipment } = data;
      if (shipment) {
        const { id: shipmentId } = shipment;
        if (shipment && !shipmentObj[shipmentId]) {
          shipmentObj[shipmentId] = initShipmentObj(shipment);
        }
        const { relation: shipmentRelation } = shipmentObj[shipmentId];
        shipmentRelation.order[orderId] = true;
        shipmentRelation.orderItem[orderItemId] = true;
        shipmentRelation.batch[id] = true;
      }
    }
  };
  return {
    getShipmentObj,
    formatShipmentObj,
  };
};

export const formatOrders = (orders: Array<Object>, shipments: Array<Object>) => {
  const orderGenerator = iterateOrders(orders);
  const orderData = createOrderObj();
  const itemData = createOrderItemObj();
  const batchData = createBatchObj();
  const shipmentData = createShipmentObj();
  let result = orderGenerator.next();
  while (!result.done) {
    orderData.formatOrderObj(result.value);
    itemData.formatOrderItemObj(result.value);
    batchData.formatBatchObj(result.value);
    shipmentData.formatShipmentObj(result.value);
    result = orderGenerator.next();
  }
  const { shipment } = shipmentData.getShipmentObj();
  const formattedResultObject = {
    ...orderData.getOrderObj(),
    ...itemData.getOrderItemObj(),
    ...batchData.getBatchObj(),
  };

  // Tracking all shipment which has no order/item/batch
  const shipmentNoRelation = {};
  shipments
    .filter(item => !shipment[item.id])
    .forEach(item => {
      shipment[item.id] = {
        data: item,
        relation: {
          batch: {},
          orderItem: {},
          order: {},
          shipment: {
            [item.id]: true,
          },
        },
      };
      shipmentNoRelation[item.id] = {
        data: item,
        relation: {
          batch: {},
          orderItem: {},
          order: {},
          shipment: {
            [item.id]: true,
          },
        },
      };
    });
  return {
    ...formattedResultObject,
    shipment,
    shipmentNoRelation,
  };
};

export default formatOrders;
