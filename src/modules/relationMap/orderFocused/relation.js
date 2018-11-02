// @flow
export const ORDER_HEADER = 'ORDER_HEADER';
export const ORDER_ITEM_ALL = 'ORDER_ITEM_ALL';
export const BATCH_ALL = 'BATCH_ALL';
export const SHIPMENT = 'SHIPMENT';
export const SHIPMENT_ALL = 'SHIPMENT_ALL';
export const ORDER = 'ORDER';
export const ORDER_ITEM = 'ORDER_ITEM';
export const BATCH = 'BATCH';
export const LINK1 = 'LINK-1';
export const LINK2 = 'LINK-2';
export const LINK4 = 'LINK-4';

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
  const { orderItems, orderItemIndex, relatedOrderItem } = data;
  const generateFirstBatch = (id, relatedIds) => {
    relations.push({
      id,
      type: `${LINK1}-${BATCH}`,
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
    type: isCollapsed ? `${LINK1}-${ORDER}` : `${LINK1}-${ORDER}`,
    id: order.id,
    relatedIds: relatedOrderIds,
  });
  relations.push({ type: ORDER_ITEM_ALL, id: order.id });
  relations.push({ type: `${LINK1}-${ORDER}`, id: order.id, relatedIds: relatedOrderIds });
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
      const relatedBatchIds = getRelatedIds(batches, batchIndex);
      batchRelation.generateBatchRelation(batch.id, relatedBatchIds, batchIndex);
    });
  });
  return relations;
};

export default generateRelation;
