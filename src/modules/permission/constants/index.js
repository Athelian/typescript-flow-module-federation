import relationMap from './relationMap';
import product from './product';
import order from './order';
import shipment from './shipment';
import batch from './batch';
import container from './container';
import customFields from './customFields';
import warehouse from './warehouse';
import tag from './tag';
import template from './template';
import staff from './staff';
import partner from './partner';

export const defaultPermissions = [
  ...product.default,
  ...order.default,
  ...shipment.default,
  ...batch.default,
  ...container.default,
  ...customFields.default,
  ...warehouse.default,
  ...tag.default,
  ...template.default,
  ...staff.default,
  ...partner.default,
];

export const managerPermissions = [
  ...product.manager,
  ...order.manager,
  ...shipment.manager,
  ...batch.manager,
  ...container.manager,
  ...warehouse.manager,
  ...tag.manager,
  ...relationMap,
  ...customFields.manager,
  ...template.manager,
  ...staff.manager,
  ...partner.manager,
];
