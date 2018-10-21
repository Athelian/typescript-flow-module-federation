import { getByPathWithDefault } from 'utils/fp';

const ORDER_HEADER = 'ORDER_HEADER';
const ORDER_ITEM_ALL = 'ORDER_ITEM_ALL';
const BATCH_ALL = 'BATCH_ALL';
const ORDER = 'ORDER';
const ORDER_ITEM = 'ORDER_ITEM';
const BATCH = 'BATCH';
const LINK0 = 'LINK-0';
const LINK1 = 'LINK-1';
const LINK2 = 'LINK-2';
// const LINK3 = 'LINK-3';
const LINK4 = 'LINK-4';

const getRelatedIds = (items, currentIndex) => {
  const ids = [];
  for (let index = items.length - 1; index >= currentIndex; index -= 1) {
    const { id } = items[index];
    ids.push(id);
  }
  return ids;
};

const createBatchRelation = (relations, data) => {
  const { orderItems, orderItemIndex, relatedOrderItem } = data;
  const generateFirstBatch = (id, relatedIds) => {
    relations.push({
      id,
      type: `${LINK0}-${BATCH}`,
      relatedIds,
    });
    relations.push({ type: BATCH, id });
  };
  const generateOtherBatch = (id, relatedIds) => {
    const isLastOrderItem = orderItemIndex === orderItems.length - 1;
    relations.push({ type: '' });
    if (isLastOrderItem) {
      relations.push({ type: '' });
    } else {
      relations.push({
        type: `${LINK2}-${ORDER_ITEM}`,
        id: orderItems[orderItemIndex].id,
        relatedIds: relatedOrderItem,
      });
    }
    relations.push({ type: '' });
    relations.push({
      id,
      type: `${LINK4}-${BATCH}`,
      relatedIds,
    });
    relations.push({ type: BATCH, id });
  };
  return {
    generateFirstBatch,
    generateOtherBatch,
    generateBatchRelation: (id, relatedIds, index) => {
      if (index === 0) {
        generateFirstBatch(id, relatedIds);
      } else {
        generateOtherBatch(id, relatedIds);
      }
    },
  };
};
const generateCollapsedRelation = (order, option) => {
  const { isCollapsed } = option;
  const relations = [];
  const { orderItems } = order;
  const numberOfProduct = orderItems.length;
  relations.push({ type: ORDER_HEADER, id: order.id });
  relations.push({ type: '' });
  relations.push({ type: '' });
  relations.push({ type: '' });
  relations.push({ type: '' });
  relations.push({ type: ORDER, id: order.id });
  if (numberOfProduct === 0) {
    relations.push({ type: '' });
    relations.push({ type: '' });
    relations.push({ type: '' });
    relations.push({ type: '' });
    return relations;
  }

  const relatedOrderIds = [order.id];
  relations.push({
    type: isCollapsed ? `${LINK0}-${ORDER}` : `${LINK1}-${ORDER}`,
    id: order.id,
    relatedIds: relatedOrderIds,
  });
  relations.push({ type: ORDER_ITEM_ALL, id: order.id });
  relations.push({ type: `${LINK0}-${ORDER}`, id: order.id, relatedIds: relatedOrderIds });
  relations.push({ type: BATCH_ALL, id: order.id });
  return relations;
};

const generateRelation = (order, option) => {
  const { isCollapsed, result } = option;
  const relations = generateCollapsedRelation(order, option);
  if (isCollapsed) {
    return relations;
  }
  const { orderItems } = order;
  // const numberOfProduct = orderItems.length;
  orderItems.forEach((orderItem, orderItemIndex) => {
    const relatedProductIds = getRelatedIds(orderItems, orderItemIndex);
    const { batches } = orderItem;
    const noBatch = batches.length === 0;
    relations.push({ type: '' });
    relations.push({
      id: orderItem.id,
      type: `${LINK4}-${ORDER_ITEM}`,
      relatedIds: relatedProductIds,
    });
    relations.push({ type: ORDER_ITEM, id: orderItem.id });
    if (noBatch) {
      relations.push({ type: '' });
      relations.push({ type: '' });
      return;
    }
    const batchRelation = createBatchRelation(relations, {
      orderItems,
      orderItemIndex,
      relatedOrderItem: relatedProductIds.filter(id => id !== orderItem.id),
    });
    batches.forEach((batch, batchIndex) => {
      const itemId = getByPathWithDefault({}, 'batch.itemId', result);
      const refId = getByPathWithDefault({}, 'batch.refId', result);
      const relatedBatchIds = getRelatedIds(batches, batchIndex);
      if (itemId[batch.id]) {
        return;
      }
      const newBatch = refId[batch.id];
      if (newBatch) {
        Object.keys(newBatch).forEach(newBatchId => {
          const relatedIds = [...relatedBatchIds, newBatchId];
          batchRelation.generateBatchRelation(newBatchId, relatedIds, batchIndex);
          batchRelation.generateOtherBatch(batch.id, relatedIds);
        });
      } else {
        batchRelation.generateBatchRelation(batch.id, relatedBatchIds, batchIndex);
      }
    });
  });
  return relations;
};

export default generateRelation;
