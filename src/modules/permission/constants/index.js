import relationMap from './relationMap';
import product from './product';

export const defaultPermissions = [...product.default];
export const managerPermissions = [...product.manager, ...relationMap];
