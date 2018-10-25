import { pipe, filter } from 'ramda';

// const filterNewData = (data, newData) =>
//   data.filter(node => (!newData ? true : !newData.some(d => d.id === node.id)));

// export const formatNodes = (nodes, result) => {
//   const { order = [], orderItem } = result;
//   const filteredOrders = filterNewData(nodes, order);
//   const formattedNodes = [...order, ...filteredOrders].map(node => {
//     let allOrderItems = node.orderItems || [];
//     if (orderItem && orderItem[node.id]) {
//       allOrderItems = [
//         ...orderItem[node.id],
//         ...filterNewData(node.orderItems, orderItem[node.id]),
//       ];
//     }
//     return {
//       id: node.id,
//       orderItems: allOrderItems,
//     };
//   });
//   return formattedNodes;
// };

const prependArray = arr => newArr => [...arr, ...newArr];

const filterOutNewData = newData => data =>
  !newData ? true : !newData.some(d => d.id === data.id);

const createFilterData = (newData = []) =>
  pipe(
    filter(filterOutNewData(newData || [])),
    prependArray(newData)
  );

export const formatNodes = (orders, result) => {
  const { order: newOrder = [], orderItem: newOrderItem = {}, batch: newBatch = {} } = result;
  const filterOrder = createFilterData(newOrder);
  const nodes = filterOrder(orders).map(order => {
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
