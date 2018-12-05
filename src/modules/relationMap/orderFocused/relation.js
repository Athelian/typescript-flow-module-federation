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

const isRelationLine = type => /LINK-[0-4]-(\w+)/.test(type);

export const getItemData = ({ order, orderItem, batch }: Object, relation: Object) => {
  let itemData;
  let type = relation.type || '';
  const isLine = isRelationLine(relation.type);
  if (isLine) {
    const [, , relationType] = relation.type.split('-') || [];
    type = relationType;
  }
  switch (type) {
    case ORDER_ITEM_ALL:
      itemData = orderItem[relation.id] || order[relation.id];
      break;
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

export const getRelatedIds = (items: Array<Object>, currentIndex: number) => {
  const ids = [];
  for (let index = items.length - 1; index >= currentIndex; index -= 1) {
    const { id } = items[index];
    ids.push(id);
  }
  return ids;
};

type generateBatch = {
  id: string,
  isNew: string | boolean,
  relatedIds: Array<string>,
  previousIds: Array<string>,
};
export const createBatchRelation = (relations: Array<Object>, data: Object) => {
  const { orderItems, orderItemIndex, relatedOrderItem } = data;
  const generateFirstBatch = ({ id, isNew, relatedIds, previousIds }: generateBatch) => {
    relations.push({
      id,
      type: `${LINK1}-${BATCH}`,
      relatedIds,
    });
    relations.push({ type: BATCH, id, isNew, relatedIds, previousIds });
  };
  const generateOtherBatch = ({ id, isNew, relatedIds, previousIds }: generateBatch) => {
    const isLastOrderItem = orderItemIndex === orderItems.length - 1;
    relations.push({ type: '' });
    if (isLastOrderItem) {
      relations.push({ type: '' });
    } else {
      relations.push({
        type: `${LINK2}-${ORDER_ITEM}`,
        id: orderItems[orderItemIndex + 1].id,
        relatedIds: relatedOrderItem,
      });
    }
    relations.push({ type: '' });
    relations.push({
      id,
      type: `${LINK4}-${BATCH}`,
      relatedIds,
    });
    relations.push({ type: BATCH, id, isNew, relatedIds, previousIds });
  };
  return {
    generateFirstBatch,
    generateOtherBatch,
    generateBatchRelation: ({
      batchData,
      relatedIds,
      index,
      previousIds,
    }: {
      batchData: Object,
      relatedIds: Array<string>,
      index: number,
      previousIds: Array<string>,
    }) => {
      const { id, isNew = false } = batchData;
      if (index === 0) {
        generateFirstBatch({ id, isNew, relatedIds, previousIds });
      } else {
        generateOtherBatch({ id, isNew, relatedIds, previousIds });
      }
    },
  };
};

export const generateCollapsedRelation = (order: Object, option: Object) => {
  const { isCollapsed } = option;
  const relations = [];
  const { orderItems } = order;
  const numberOfProduct = orderItems.length;
  relations.push({ type: ORDER_HEADER, id: order.id });
  relations.push({ type: '' });
  relations.push({ type: '' });
  relations.push({ type: '' });
  relations.push({ type: '' });
  relations.push({ type: ORDER, id: order.id, isNew: order.isNew, previousIds: [] });
  if (numberOfProduct === 0) {
    relations.push({ type: '' });
    relations.push({ type: '' });
    relations.push({ type: '' });
    relations.push({ type: '' });
    return relations;
  }
  const relatedOrderIds = [order.id];
  const hasOrderItem = order.orderItems[0];
  relations.push({
    type: isCollapsed
      ? `${LINK1}-${hasOrderItem ? ORDER_ITEM : ORDER}`
      : `${LINK1}-${ORDER_ITEM_ALL}`,
    id: hasOrderItem ? order.orderItems[0].id : order.id,
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
  const previousOrderItemIds = [];
  orderItems.forEach((orderItem, orderItemIndex) => {
    const relatedProductIds = getRelatedIds(orderItems, orderItemIndex);
    previousOrderItemIds.push(orderItem.id);
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
      relatedIds: relatedProductIds,
      previousIds: previousOrderItemIds,
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
    });
    const previousBatchIds = [];
    batches.forEach((batch, batchIndex) => {
      const relatedBatchIds = getRelatedIds(batches, batchIndex);
      previousBatchIds.push(batch.id);
      batchRelation.generateBatchRelation({
        batchData: batch,
        index: batchIndex,
        relatedIds: relatedBatchIds,
        previousIds: previousBatchIds,
      });
    });
  });
  return relations;
};

export default generateRelation;
