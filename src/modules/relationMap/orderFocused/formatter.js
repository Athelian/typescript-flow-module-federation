const filterNewData = (data, newData) =>
  data.filter(node => (!newData ? true : !newData.some(d => d.id === node.id)));

export const formatNodes = (nodes, result) => {
  const { order = [], orderItem } = result;
  const filteredOrders = filterNewData(nodes, order);
  const formattedNodes = [...order, ...filteredOrders].map(node => {
    let allOrderItems = node.orderItems || [];
    if (orderItem && orderItem[node.id]) {
      allOrderItems = [
        ...orderItem[node.id],
        ...filterNewData(node.orderItems, orderItem[node.id]),
      ];
    }
    return {
      id: node.id,
      orderItems: allOrderItems,
    };
  });
  return formattedNodes;
};

export default null;
