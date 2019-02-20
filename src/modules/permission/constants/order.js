export const ORDER_LIST = 'order.orders.list';
export const ORDER_GET = 'order.orders.get';
export const ORDER_CREATE = 'order.orders.create';
export const ORDER_UPDATE = 'order.orders.update';

const order = {
  default: [ORDER_LIST, ORDER_GET],
  manager: [ORDER_LIST, ORDER_GET, ORDER_CREATE, ORDER_UPDATE],
};

export default order;
