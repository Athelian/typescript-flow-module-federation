import relationMap from './relationMap';
import product from './product';
import order from './order';
import shipment from './shipment';
import batch from './batch';

export const defaultPermissions = [
  ...product.default,
  ...order.default,
  ...shipment.default,
  ...batch.default,
];
export const managerPermissions = [
  ...product.manager,
  ...order.manager,
  ...shipment.manager,
  ...batch.manager,
  ...relationMap,
];
