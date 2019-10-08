import { normalize, schema } from 'normalizr';
import memoize from 'memoize-one';
import isDeepEqual from 'react-fast-compare';

const batch = new schema.Entity('batches');
const container = new schema.Entity('containers');
const orderItem = new schema.Entity('orderItems');
const shipment = new schema.Entity('shipments');
const order = new schema.Entity('orders');
const ownedBy = new schema.Entity('organizations');
const hit = new schema.Entity('hits');
const entity = new schema.Entity(
  'entity',
  {},
  { idAttribute: value => `${value.id}-${value.__typename}` }
);
const entityHit = new schema.Entity('entityHits');
entityHit.define({
  entity,
});
hit.define({
  entityHits: [entityHit],
});

batch.define({
  orderItem,
  shipment,
  container,
  ownedBy,
});

container.define({
  shipment,
  ownedBy,
});

orderItem.define({
  order,
  ownedBy,
});

order.define({
  ownedBy,
});

shipment.define({
  batches: [batch],
  containers: [container],
  ownedBy,
});

export default memoize(originalData => {
  const { entities } = normalize(originalData, { shipments: [shipment] });
  return entities;
}, isDeepEqual);

export const normalizeEntity = memoize(originalData => {
  const { entities } = normalize(originalData, { hits: [hit] });
  return entities;
}, isDeepEqual);
