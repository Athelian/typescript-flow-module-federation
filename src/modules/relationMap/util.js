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
        const relatedBatchIds = getRelatedIds(batches, batchIndex, resultId.batchIds);

        if (result.batch[batch.id]) {
          const newBatches = result.batch[batch.id];
          newBatches.forEach(newBatchId => {
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

export const getBatchArrivalDate = (batch: Object) => {
  const arrivalDates = getByPathWithDefault(
    [],
    'shipment.containerGroups.0.warehouseArrival.timelineDateRevisions',
    batch
  );

  return arrivalDates.length > 0
    ? arrivalDates[arrivalDates.length - 1].date
    : getByPathWithDefault('', 'shipment.containerGroups.0.warehouseArrival.date', batch);
};

export const sortBatchByArrivalDate = (batchA: Object, batchB: Object) => {
  const arrivalDateA = getBatchArrivalDate(batchA);
  const arrivalDateB = getBatchArrivalDate(batchB);

  if (arrivalDateA < arrivalDateB) {
    return 1;
  }
  if (arrivalDateA > arrivalDateB) {
    return -1;
  }
  return 0;
};
