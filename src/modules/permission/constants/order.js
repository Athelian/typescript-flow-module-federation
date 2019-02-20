export const ORDER_LIST = 'order.orders.list';
export const ORDER_GET = 'order.orders.get';
export const ORDER_CREATE = 'order.orders.create';
export const ORDER_UPDATE = 'order.orders.update';
export const ORDER_DOWNLOAD_DOCUMENTS = 'order.orders.downloadDocuments';

const order = {
  default: [ORDER_LIST, ORDER_GET, ORDER_DOWNLOAD_DOCUMENTS],
  weinhaus: [],
  manager: [ORDER_LIST, ORDER_GET, ORDER_CREATE, ORDER_UPDATE, ORDER_DOWNLOAD_DOCUMENTS],
};

export default order;
