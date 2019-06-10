// @flow

export const parseRoute = (entityType: string) => {
  const specialRoutes = {
    orderItem: 'order-item',
  };

  return specialRoutes[entityType] ? specialRoutes[entityType] : entityType;
};

export default parseRoute;
