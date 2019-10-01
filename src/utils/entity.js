// @flow

const mappingRoutes = {
  orderItem: 'order-item',
};

const mappingIcon = {
  OrderItem: 'ORDER_ITEM',
};

export const parseRoute = (entityType: string) => {
  return mappingRoutes[entityType] || entityType;
};

export const parseIcon = (entityType: string) => {
  return mappingIcon[entityType] || entityType.toUpperCase() || 'ORDER';
};