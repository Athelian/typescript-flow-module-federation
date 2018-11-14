// @flow
import {
  ORDER_HEADER,
  ORDER_ITEM_ALL,
  BATCH_ALL,
  ORDER,
  ORDER_ITEM,
  BATCH,
  LINK1,
  LINK2,
  LINK4,
} from 'modules/relationMap/constants';

export const getItemData = ({ order, orderItem, batch }: Object, relation: Object) => {
  let itemData;
  switch (relation.type) {
    case ORDER_ITEM_ALL:
    case BATCH_ALL:
    case ORDER:
      itemData = order[relation.id];
      break;
    case ORDER_HEADER:
      itemData = { data: { id: relation.id } };
      break;
    case ORDER_ITEM:
      itemData = orderItem[relation.id];
      break;
    case BATCH:
      itemData = batch[relation.id];
      break;
    default:
      itemData = {};
      break;
  }
  return itemData;
};

export const getItemType = (type: string) => {
  switch (type) {
    case ORDER_ITEM_ALL:
    case BATCH_ALL:
    case ORDER:
      return 'order';
    case ORDER_HEADER:
    case ORDER_ITEM:
      return 'orderItem';
    case BATCH:
      return 'batch';
    default:
      return '';
  }
};

const getRelatedIds = (items: Array<Object>, currentIndex: number) => {
  const ids = [];
  for (let index = items.length - 1; index >= currentIndex; index -= 1) {
    const { id } = items[index];
    ids.push(id);
  }
  return ids;
};

const createBatchRelation = (relations: Array<Object>, data: Object) => {
  const { orderItems, orderItemIndex, relatedOrderItem, numberOfBatch } = data;
  const generateFirstBatch = ({ id, isNew, relatedIds, isLast }) => {
    relations.push({
      id,
      type: `${LINK1}-${BATCH}`,
      relatedIds,
    });
    relations.push({ type: BATCH, id, isNew, isLast });
  };
  const generateOtherBatch = ({ id, isNew, relatedIds, isLast }) => {
    const isLastOrderItem = orderItemIndex === orderItems.length - 1;
    relations.push({ type: '' });
    if (isLastOrderItem) {
      relations.push({ type: '' });
    } else {
      relations.push({
        type: `${LINK2}-${BATCH}`,
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
    relations.push({ type: BATCH, id, isNew, isLast });
  };
  return {
    generateFirstBatch,
    generateOtherBatch,
    generateBatchRelation: (batchData, relatedIds, index) => {
      const { id, isNew = false } = batchData;
      const isLast = index === numberOfBatch - 1;
      if (index === 0) {
        generateFirstBatch({ id, isNew, relatedIds, isLast });
      } else {
        generateOtherBatch({ id, isNew, relatedIds, isLast });
      }
    },
  };
};

const generateCollapsedRelation = (order: Object, option: Object) => {
  const { isCollapsed } = option;
  const relations = [];
  const { orderItems } = order;
  const numberOfProduct = orderItems.length;
  relations.push({ type: ORDER_HEADER, id: order.id });
  relations.push({ type: '' });
  relations.push({ type: '' });
  relations.push({ type: '' });
  relations.push({ type: '' });
  relations.push({ type: ORDER, id: order.id, isNew: order.isNew });
  if (numberOfProduct === 0) {
    relations.push({ type: '' });
    relations.push({ type: '' });
    relations.push({ type: '' });
    relations.push({ type: '' });
    return relations;
  }
  const relatedOrderIds = [order.id];
  relations.push({
    type: isCollapsed ? `${LINK1}-${ORDER}` : `${LINK1}-${ORDER_ITEM_ALL}`,
    id: order.id,
    relatedIds: relatedOrderIds,
  });
  relations.push({ type: ORDER_ITEM_ALL, id: order.id });
  relations.push({
    type: isCollapsed ? `${LINK1}-${ORDER}` : `${LINK1}-${BATCH_ALL}`,
    id: order.id,
    relatedIds: relatedOrderIds,
  });
  relations.push({ type: BATCH_ALL, id: order.id });
  return relations;
};

const generateRelation = (order: Object, option: Object) => {
  const { isCollapsed } = option;
  const relations = generateCollapsedRelation(order, option);
  if (isCollapsed) {
    return relations;
  }
  const { orderItems } = order;
  const lastOrderItem = orderItems.length - 1;
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
    relations.push({
      type: ORDER_ITEM,
      id: orderItem.id,
      isNew: orderItem.isNew,
      isLast: lastOrderItem === orderItemIndex,
    });
    if (noBatch) {
      relations.push({ type: '' });
      relations.push({ type: '' });
      return;
    }
    const batchRelation = createBatchRelation(relations, {
      orderItems,
      orderItemIndex,
      relatedOrderItem: relatedProductIds.filter(id => id !== orderItem.id),
      numberOfBatch: batches.length,
    });
    batches.forEach((batch, batchIndex) => {
      const relatedBatchIds = getRelatedIds(batches, batchIndex);
      batchRelation.generateBatchRelation(batch, relatedBatchIds, batchIndex);
    });
  });
  return relations;
};

export default generateRelation;
