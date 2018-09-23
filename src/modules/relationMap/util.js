import { getByPathWithDefault } from 'utils/fp';

const getLinkType = (itemNo, numberOfItem) => {
  let linkType = { type: 'LINK-4' };
  if (numberOfItem > 1) {
    linkType = { type: 'LINK-3' };
    if (itemNo === numberOfItem) {
      linkType = { type: 'LINK-4' };
    }
  }
  return linkType;
};

const getBatchLinkType = (itemNo, numberOfItem) => {
  let linkType = { type: 'LINK-0' };
  if (numberOfItem > 1) {
    if (itemNo === 1) {
      linkType = { type: 'LINK-1' };
    } else if (itemNo === numberOfItem) {
      linkType = { type: 'LINK-4' };
    } else {
      linkType = { type: 'LINK-3' };
    }
  }
  return linkType;
};

export const generateOrderRelation = (order, option) => {
  const orderRelations = [];
  const { orderItems } = order;
  const numberOfProduct = orderItems.length;

  orderRelations.push({ type: 'ORDER', id: order.id });
  if (numberOfProduct === 0) {
    orderRelations.push({ type: '' });
    orderRelations.push({ type: '' });
    orderRelations.push({ type: '' });
    orderRelations.push({ type: '' });
    return orderRelations;
  }

  orderRelations.push({ type: option.isCollapsed ? 'LINK-0' : 'LINK-1', id: order.id });
  orderRelations.push({ type: 'ORDER_ITEM_ALL', id: order.id });
  orderRelations.push({ type: 'LINK-0', id: order.id });
  orderRelations.push({ type: 'BATCH_ALL', id: order.id });
  if (!option.isCollapsed) {
    orderItems.forEach((product, index) => {
      const productNo = index + 1;
      const { batches } = product;
      const numberOfBatch = batches.length;
      const linkType = getLinkType(productNo, numberOfProduct);

      orderRelations.push({ type: '' });
      orderRelations.push(linkType);
      orderRelations.push({ type: 'ORDER_ITEM', id: product.id });
      if (numberOfBatch === 0) {
        orderRelations.push({ type: '' });
        orderRelations.push({ type: '' });
      }
      batches.forEach((batch, batchIndex) => {
        const batchNo = batchIndex + 1;
        const linkType2 = getBatchLinkType(batchNo, numberOfBatch);
        if (batchNo > 1) {
          orderRelations.push({ type: '' });
          const productLink =
            productNo === numberOfProduct ? { type: '' } : { type: 'LINK-2', id: order.id };
          orderRelations.push(productLink);
          orderRelations.push({ type: '' });
        }
        orderRelations.push(linkType2);
        orderRelations.push({ type: 'BATCH', id: batch.id });
      });
    });
  }

  return orderRelations;
};

export const generateRelationConfig = data => {
  const relations = [];
  data.forEach(order => {
    const orderRelations = generateOrderRelation(order);
    relations.push(orderRelations);
  });
  return relations;
};

export const generateShipmentRelation = (shipment, option) => {
  const relations = [];
  relations.push({ type: 'ORDER_ITEM_ALL', id: shipment.id });
  relations.push({ type: 'LINK-0', id: shipment.id });
  relations.push({ type: 'BATCH_ALL', id: shipment.id });
  relations.push({ type: 'LINK-0', id: shipment.id });
  relations.push({ type: option.isCollapsed ? 'SHIPMENT_ALL' : 'SHIPMENT', id: shipment.id });
  const numberOfBatch = shipment.batches.length;
  if (!option.isCollapsed) {
    shipment.batches.forEach((batch, batchIndex) => {
      relations.push({ type: 'ORDER_ITEM', id: shipment.id });
      relations.push({ type: 'LINK-0', id: shipment.id });
      relations.push({ type: 'BATCH', id: shipment.id });
      relations.push({ type: '', id: shipment.id });
      if (batchIndex > 1) {
        relations.push({ type: '', id: shipment.id });
      }
    });
    const MIN_ROW = 2;
    if (numberOfBatch < MIN_ROW) {
      for (let index = numberOfBatch; index < MIN_ROW; index += 1) {
        for (let item = 0; item < 4; item += 1) {
          relations.push({ type: '', id: shipment.id });
        }
      }
    }
  }
  return relations;
};

export const formatShipmentOrder = orders => {
  const shipmentObj = {};
  orders.forEach(order => {
    const { shipments, id: orderId } = order;
    shipments.forEach(shipment => {
      if (!shipmentObj[shipment.id]) {
        shipmentObj[shipment.id] = { data: shipment, refs: {} };
      }
      shipmentObj[shipment.id].refs[orderId] = true;
    });
  });
  return shipmentObj;
};

export const formatOrderFromShipment = shipments => {
  const orderObj = {};
  shipments.forEach(shipment => {
    const { batches, id: shipmentId } = shipment;
    batches.forEach(batch => {
      const order = getByPathWithDefault({}, 'orderItem.order', batch);
      if (!orderObj[order.id]) {
        orderObj[order.id] = { data: shipment, refs: {} };
      }
      orderObj[order.id].refs[shipmentId] = true;
    });
  });
  return orderObj;
};

export const formatOrderData = orders => {
  const orderObj = {};
  const orderItemObj = {};
  const batchObj = {};
  const sumOrders = orders.length;
  let sumOrderItems = 0;
  let sumBatches = 0;
  let sumShipments = 0;
  orders.forEach(order => {
    const { orderItems, shipments } = order;
    if (!orderObj[order.id]) {
      orderObj[order.id] = {
        orderedQuantity: 0,
        batchedQuantity: 0,
        shippedQuantity: 0,
        totalItem: orderItems.length,
        totalBatch: 0,
        info: order.poNo,
      };
    }
    sumOrderItems += orderItems ? orderItems.length : 0;
    sumShipments += shipments ? shipments.length : 0;

    orderItems.forEach(orderItem => {
      if (!orderItemObj[orderItem.id]) {
        orderItemObj[orderItem.id] = {
          orderedQuantity: 0,
          batchedQuantity: 0,
          shippedQuantity: 0,
          info: getByPathWithDefault('', 'productProvider.product.name', orderItem),
        };
      }
      sumBatches += orderItem.batches ? orderItem.batches.length : 0;
      orderObj[order.id].totalBatch += orderItem.batches ? orderItem.batches.length : 0;
      orderObj[order.id].orderedQuantity += orderItem.quantity || 0;
      orderItemObj[orderItem.id].orderedQuantity += orderItem.quantity;

      orderItem.batches.forEach(batch => {
        if (!batchObj[batch.id]) {
          const volume = getByPathWithDefault('', 'packageVolume.value', batch);
          const metric = getByPathWithDefault('', 'packageVolume.metric', batch);
          batchObj[batch.id] = {
            quantity: batch.quantity,
            volume: `${volume} ${metric}`,
            totalItem: batch.length,
            title: batch.no || '',
          };
        }
        orderObj[order.id].batchedQuantity += batch.quantity;
        orderItemObj[orderItem.id].batchedQuantity += batch.quantity;
        if (batch.shipment) {
          orderObj[order.id].shippedQuantity += batch.quantity;
          orderItemObj[orderItem.id].shippedQuantity += batch.quantity;
        }
      });
    });
  });

  return {
    orderObj,
    orderItemObj,
    batchObj,
    sumOrders,
    sumOrderItems,
    sumBatches,
    sumShipments,
  };
};
