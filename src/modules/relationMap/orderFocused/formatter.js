// @flow
import { pipe, filter } from 'ramda';

const prependArray = (arr: Array<any>) => (newArr: Array<any>) => [...arr, ...newArr];

const filterOutNewData = (newData: Array<Object>) => (data: Object) =>
  !newData ? true : !newData.some(d => d.id === data.id);

const createFilterData = (newData: Array<Object> = []) =>
  pipe(
    filter(filterOutNewData(newData || [])),
    prependArray(newData)
  );

export const formatNodes = (orders: Array<Object>, result: Object) => {
  const { order: newOrder = [], orderItem: newOrderItem = {}, batch: newBatch = {} } = result;
  const filterOrder = createFilterData(newOrder);
  const nodes: Array<Object> = filterOrder(orders).map(order => {
    const filterOrderItem = createFilterData(newOrderItem[order.id]);
    const orderItems = filterOrderItem(order.orderItems || []).map(orderItem => {
      const filterBatch = createFilterData(newBatch[orderItem.id]);
      const batches = filterBatch(orderItem.batches || []).map(batch => ({ id: batch.id }));
      return {
        id: orderItem.id,
        batches,
      };
    });
    return {
      id: order.id,
      orderItems,
    };
  });
  return nodes;
};

export default null;
