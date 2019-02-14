import relationMap from './relationMap';
import product from './product';
import order from './order';
import shipment from './shipment';

export const defaultPermissions = [...product.default, ...order.default, ...shipment.default];
export const managerPermissions = [
  ...product.manager,
  ...order.manager,
  ...shipment.manager,
  ...relationMap,
];
