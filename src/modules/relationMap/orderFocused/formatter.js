// @flow
import { pipe, filter, isEmpty } from 'ramda';

const prependArray = (arr: Array<any>) => (newArr: Array<any>) => [...arr, ...newArr];

const filterOutNewData = (newData: Array<Object>) => (data: Object) =>
  !newData ? true : !newData.some(d => d.id === data.id);

const createFilterData = (newData: Array<Object> = []) =>
  pipe(
    filter(filterOutNewData(newData || [])),
    prependArray(newData.map(d => Object.assign(d, { isNew: true })))
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
        id: batch.id,
        isNew: getIsNew(batch),
      }));
      return {
        id: orderItem.id,
        isNew: getIsNew(orderItem),
        batches,
      };
    });
    return {
      id: order.id,
      isNew: getIsNew(order),
      isCollapsed: getIsCollapsed({ newOrderItem, newBatch }, order),
      orderItems,
    };
  });
  return nodes;
};

export default null;
