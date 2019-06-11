// @flow

const mappingRoutes = {
  orderItem: 'order-item',
};
export const parseRoute = (entityType: string) => {
  return mappingRoutes[entityType] || entityType;
};

export default parseRoute;
