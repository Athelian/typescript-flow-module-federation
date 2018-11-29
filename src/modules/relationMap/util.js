// @flow
import { getByPathWithDefault } from 'utils/fp';

const getBatchLinkType = (itemNo, numberOfItem, haveNewItem) => {
  let linkType = 'LINK-0';
  if (numberOfItem > 1) {
    if (itemNo === 1 && !haveNewItem) {
      linkType = 'LINK-1';
    } else if (itemNo === numberOfItem) {
      linkType = 'LINK-4';
    } else {
      linkType = 'LINK-4';
    }
  }
  return linkType;
};
// @TODO add cache (memorized) data
const getRelatedIds = (items, currentIndex, resultIds) => {
  const ids = [];
  for (let index = items.length - 1; index >= currentIndex; index -= 1) {
    const { id } = items[index];
    if (!(resultIds && resultIds.some(resultId => resultId === id))) {
      ids.push(id);
    }
  }
  return ids;
};

export const generateOrderRelation = (order: Object, option: Object = {}): Array<Object> => {
  const { isCollapsed, result, resultId } = option;
  const orderRelations = [];
  const { orderItems } = order;
  const numberOfProduct = orderItems.length;
  orderRelations.push({ type: 'ORDER_HEADER', id: order.id });
  orderRelations.push({ type: '' });
  orderRelations.push({ type: '' });
  orderRelations.push({ type: '' });
  orderRelations.push({ type: '' });
  orderRelations.push({ type: 'ORDER', id: order.id });
  if (numberOfProduct === 0) {
    orderRelations.push({ type: '' });
    orderRelations.push({ type: '' });
    orderRelations.push({ type: '' });
    orderRelations.push({ type: '' });
    return orderRelations;
  }

  orderRelations.push({
    type: isCollapsed ? 'LINK-0' : 'LINK-1',
    id: order.id,
    relatedIds: [order.id],
    itemType: 'order',
  });
  orderRelations.push({ type: 'ORDER_ITEM_ALL', id: order.id });
  orderRelations.push({ type: 'LINK-0', id: order.id, relatedIds: [order.id], itemType: 'order' });
  orderRelations.push({ type: 'BATCH_ALL', id: order.id });
  if (!isCollapsed) {
    orderItems.forEach((product, index) => {
      const relatedProductIds = getRelatedIds(orderItems, index);

      const productNo = index + 1;
      const { batches } = product;
      const numberOfBatch = batches.length;

      orderRelations.push({ type: '' });
      orderRelations.push({
        id: product.id,
        itemType: 'orderItem',
        type: 'LINK-4',
        relatedIds: relatedProductIds,
      });
      orderRelations.push({ type: 'ORDER_ITEM', id: product.id });
      if (numberOfBatch === 0) {
        orderRelations.push({ type: '' });
        orderRelations.push({ type: '' });
      }
      batches.forEach((batch, batchIndex) => {
        const batchNo = batchIndex + 1;
        // if (resultId.batchIds.some(bId => bId === batch.id)) {
        //   return;
        // }
        const relatedBatchIds = getRelatedIds(batches, batchIndex, resultId.batchIds);

        if (result.batch[batch.id]) {
          const newBatches = result.batch[batch.id];
          newBatches.forEach(newBatchId => {
            // const newBatchNo = newBatchIndex + 1;
            if (batchNo > 1) {
              orderRelations.push({ type: '' });
              orderRelations.push({
                type: 'LINK-2',
                id: product.id,
                itemType: 'orderItem',
                relatedIds: relatedProductIds.filter(id => id !== product.id),
              });
              orderRelations.push({ type: '' });
            }
            orderRelations.push({
              type: batchNo === 1 ? 'LINK-1' : 'LINK-4',
              id: newBatchId,
              itemType: 'batch',
              relatedIds: [...relatedBatchIds, newBatchId],
            });
            orderRelations.push({ type: 'BATCH', id: newBatchId });
          });
        }
        if (batchNo > 1) {
          orderRelations.push({ type: '' });
          const productLink =
            productNo === numberOfProduct
              ? { type: '' }
              : {
                  type: 'LINK-2',
                  id: product.id,
                  itemType: 'orderItem',
                  relatedIds: relatedProductIds.filter(id => id !== product.id),
                };
          orderRelations.push(productLink);
          orderRelations.push({ type: '' });
        } else if (batchNo === 1 && result.batch[batch.id]) {
          orderRelations.push({ type: '' });
          orderRelations.push({
            type: 'LINK-2',
            id: product.id,
            itemType: 'orderItem',
            relatedIds: relatedProductIds.filter(id => id !== product.id),
          });
          orderRelations.push({ type: '' });
        }
        orderRelations.push({
          id: batch.id,
          itemType: 'batch',
          type: getBatchLinkType(batchNo, numberOfBatch, !!result.batch[batch.id]),
          relatedIds: relatedBatchIds,
        });
        orderRelations.push({ type: 'BATCH', id: batch.id });
      });
    });
  }

  return orderRelations;
};

export const generateRelationConfig = (data: Array<Object>) => {
  const relations = [];
  data.forEach(order => {
    const orderRelations = generateOrderRelation(order);
    relations.push(orderRelations);
  });
  return relations;
};

export const generateShipmentRelation = (shipment: Object, option: Object) => {
  const relations = [];
  relations.push({ type: 'ORDER_ITEM_ALL', id: shipment.id });
  relations.push({ type: 'LINK-0', id: shipment.id });
  relations.push({ type: 'BATCH_ALL', id: shipment.id });
  relations.push({ type: 'LINK-0', id: shipment.id });
  relations.push({ type: option.isCollapsed ? 'SHIPMENT_ALL' : 'SHIPMENT', id: shipment.id });
  const numberOfBatch = shipment.batches.length;
  if (!option.isCollapsed) {
    shipment.batches.forEach((batch, batchIndex) => {
      relations.push({ type: 'ORDER_ITEM', id: getByPathWithDefault('', 'orderItem.id', batch) });
      relations.push({ type: 'LINK-0', id: shipment.id });
      relations.push({ type: 'BATCH', id: batch.id });
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

export const formatShipmentFromOrder = (orders: Array<Object>) => {
  const shipmentObj = {};
  orders.forEach(order => {
    const { shipments, id: orderId } = order;
    shipments.forEach(shipment => {
      if (!shipmentObj[shipment.id]) {
        shipmentObj[shipment.id] = {
          data: {
            ...shipment,
            totalOrder: 0,
            totalBatch: shipment.batches.length,
          },
          refs: {},
        };
      }
      shipmentObj[shipment.id].data.totalOrder += 1;
      shipmentObj[shipment.id].refs[orderId] = true;
    });
  });
  return shipmentObj;
};

export const formatOrderFromShipment = (shipments: Array<Object>) => {
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

const initOrderObj = order => {
  const { orderItems, id: orderId } = order;
  return {
    data: {
      ...order,
      orderedQuantity: 0,
      batchedQuantity: 0,
      shippedQuantity: 0,
      totalItem: orderItems.length || 0,
      totalBatch: 0,
    },
    relation: {
      order: { [orderId]: true },
      orderItem: {},
      batch: {},
      shipment: {},
    },
  };
};

const initShipmentObj = shipment => ({
  data: {
    ...shipment,
    totalOrder: 0,
    totalBatch: getByPathWithDefault(0, 'batches.length', shipment),
  },
  relation: {
    order: {},
    orderItem: {},
    batch: {},
    shipment: { [shipment.id]: true },
  },
});

const initOrderItemObj = (orderItem, orderId) => ({
  data: {
    ...orderItem,
    name: getByPathWithDefault('', 'productProvider.product.name', orderItem),
    orderedQuantity: orderItem.quantity,
    batchedQuantity: 0,
    shippedQuantity: 0,
    orderId,
  },
  relation: {
    order: { [orderId]: true },
    orderItem: { [orderItem.id]: true },
    batch: {},
    shipment: {},
  },
});

const initBatchObj = (batch, orderId, orderItemId) => {
  const volume = getByPathWithDefault(0, 'packageVolume.value', batch);
  const metric = getByPathWithDefault('', 'packageVolume.metric', batch);
  const packageQuantity = batch.packageQuantity || 0;
  return {
    data: {
      ...batch,
      volumeLabel: volume * packageQuantity,
      metric,
      batchedQuantity: 0,
      orderId,
      orderItemId,
    },
    relation: {
      order: { [orderId]: true },
      orderItem: { [orderItemId]: true },
      batch: { [batch.id]: true },
      shipment: batch.shipment ? { [batch.shipment.id]: true } : {},
    },
  };
};

export const formatOrderData = (orders: Array<Object> = []) => {
  const orderObj = {};
  const orderItemObj = {};
  const batchObj = {};
  const shipmentObj = {};
  const sumOrders = orders.length;
  let sumOrderItems = 0;
  let sumBatches = 0;
  let sumShipments = 0;

  orders.forEach(order => {
    const { orderItems, shipments, id: orderId } = order;
    if (!orderObj[orderId]) {
      orderObj[orderId] = initOrderObj(order);
    }
    const { relation: orderRelation, data: orderData } = orderObj[orderId];
    sumOrderItems += orderItems ? orderItems.length : 0;
    sumShipments += shipments ? shipments.length : 0;

    shipments.forEach(shipment => {
      if (!shipmentObj[shipment.id]) {
        shipmentObj[shipment.id] = initShipmentObj(shipment);
      }
      shipmentObj[shipment.id].data.totalOrder += 1;
      shipmentObj[shipment.id].relation.order[orderId] = true;
    });

    orderItems.forEach((orderItem, orderItemId) => {
      const { batches } = orderItem;
      if (!orderItemObj[orderItem.id]) {
        orderRelation.orderItem[orderItem.id] = {
          ...orderItem,
          parentId: orderId,
          index: orderItemId,
        };
        orderItemObj[orderItem.id] = initOrderItemObj(orderItem, orderId);
      }
      const { relation: orderItemRelation, data: orderItemData } = orderItemObj[orderItem.id];
      sumBatches += batches ? batches.length : 0;
      orderData.totalBatch += batches ? batches.length : 0;
      orderData.orderedQuantity += orderItem.quantity || 0;

      batches.forEach((batch, batchIndex) => {
        const { shipment } = batch;
        let batchedQuantity = batch.quantity;
        if (!batchObj[batch.id]) {
          const batchRelation = {
            ...batch,
            rootId: order.id,
            parentId: orderItem.id,
            index: batchIndex,
          };
          orderRelation.batch[batch.id] = batchRelation;
          orderItemRelation.batch[batch.id] = batchRelation;
          batchObj[batch.id] = initBatchObj(batch, order.id, orderItem.id);
          if (batch.batchAdjustments) {
            batchedQuantity = batch.batchAdjustments.reduce(
              (totalQuantity, batchAdjustment) => totalQuantity + batchAdjustment.quantity,
              batchedQuantity
            );
          }
          batchObj[batch.id].data.batchedQuantity = batchedQuantity;
          if (shipment) {
            orderRelation.shipment[shipment.id] = true;
            orderItemRelation.shipment[shipment.id] = true;
            if (!shipmentObj[shipment.id]) {
              shipmentObj[shipment.id] = initShipmentObj(shipment);
            }
            const { relation: shipmentRelation } = shipmentObj[shipment.id];
            shipmentObj[shipment.id].data.metric = getByPathWithDefault(
              '',
              'packageVolume.metric',
              batch
            );
            shipmentRelation.order[order.id] = true;
            shipmentRelation.orderItem[orderItem.id] = true;
            shipmentRelation.batch[batch.id] = true;
          }
        }
        orderData.batchedQuantity += batchedQuantity;
        orderItemData.batchedQuantity += batchedQuantity;
        if (batch.shipment) {
          orderData.shippedQuantity += batchedQuantity;
          orderItemData.shippedQuantity += batchedQuantity;
        }
      });
    });
  });

  return {
    order: orderObj,
    orderItem: orderItemObj,
    batch: batchObj,
    shipment: shipmentObj,
    sumOrders,
    sumOrderItems,
    sumBatches,
    sumShipments,
  };
};

export const formatShipmentData = (shipments: Array<Object>) => {
  const orderItemObj = {};
  const batchObj = {};
  const orderObj = {};
  const shipmentObj = {};
  let sumOrders = 0;
  let sumOrderItems = 0;
  let sumBatches = 0;
  const sumShipments = shipments.length;
  shipments.forEach(shipment => {
    sumBatches += shipment.batches ? shipment.batches.length : 0;
    if (!shipmentObj[shipment.id]) {
      shipmentObj[shipment.id] = {
        data: {
          ...shipment,
          numberOfOrder: 0,
          numberOfBatch: shipment.batches.length,
        },
        totalBatch: 0,
        totalItem: 0,
      };
    }
    shipment.batches.forEach(batch => {
      if (!batchObj[batch.id]) {
        const volume = getByPathWithDefault('', 'packageVolume.value', batch);
        const metric = getByPathWithDefault('', 'packageVolume.metric', batch);
        batchObj[batch.id] = {
          quantity: batch.quantity,
          volume: `${volume} ${metric}`,
          totalItem: batch.length,
          title: batch.no || '',
          tags: batch.tags,
          deliveredAt: batch.deliveredAt,
        };
      }
      const { orderItem } = batch;
      if (orderItem && !orderItemObj[orderItem.id]) {
        orderItemObj[orderItem.id] = {
          orderedQuantity: orderItem.quantity,
          batchedQuantity: 0,
          shippedQuantity: 0,
          info: getByPathWithDefault('', 'productProvider.product.name', orderItem),
        };
      }
      const { order } = orderItem;
      if (orderItem.order && !orderObj[order.id]) {
        shipmentObj[shipment.id].data.numberOfOrder += 1;
        orderObj[order.id] = {
          orderedQuantity: 0,
          batchedQuantity: 0,
          shippedQuantity: 0,
          info: order.poNo,
          tags: order.tags,
        };
      }
      orderObj[order.id].orderedQuantity += orderItem.quantity || 0;
      orderObj[order.id].batchedQuantity += batch.quantity;
      orderItemObj[orderItem.id].batchedQuantity += batch.quantity;

      if (batch.shipment) {
        orderObj[order.id].shippedQuantity += batch.quantity;
        orderItemObj[orderItem.id].shippedQuantity += batch.quantity;
      }
      sumOrderItems += batch.orderItem ? 1 : 0;
      // sumOrders += getByPathWithDefault(false, 'orderItem.order', batch) ? 1 : 0

      shipmentObj[shipment.id].totalItem += batch.orderItem ? 1 : 0;
      shipmentObj[shipment.id].totalBatch += getByPathWithDefault(false, 'orderItem.order', batch)
        ? 1
        : 0;
    });
  });
  sumOrders = Object.keys(orderObj || {}).length;
  return {
    order: orderObj,
    orderItem: orderItemObj,
    batch: batchObj,
    shipment: shipmentObj,
    sumOrders,
    sumOrderItems,
    sumBatches,
    sumShipments,
  };
};

export const calculateTotalPackageGrossWeight = (batches: Array<Object>) => {
  if (!batches || !batches.length) {
    return 0;
  }

  return batches.reduce((accumulator, { packageVolume, packageQuantity = 0 }) => {
    const { metric, value } = packageVolume || {};
    const addingValue = (packageVolume && value) || 0;

    switch (metric) {
      case 'cm³':
        return accumulator + packageQuantity * addingValue;
      case 'm³':
        return accumulator + packageQuantity * addingValue * 1000;
      default:
        return accumulator;
    }
  }, 0);
};
