import relationMap from './relationMap';
import product from './product';
import order from './order';

export const defaultPermissions = [...product.default, ...order.default];
export const managerPermissions = [...product.manager, ...order.manager, ...relationMap];
