import { normalize, schema } from 'normalizr';
import memoize from 'memoize-one';
import isDeepEqual from 'lodash.isequal';

const batch = new schema.Entity('batches');
const container = new schema.Entity('containers');
const orderItem = new schema.Entity('orderItems');
const shipment = new schema.Entity('shipments');
const order = new schema.Entity('orders');
const ownedBy = new schema.Entity('organizations');

batch.define({
  shipment,
  container,
  ownedBy,
});

container.define({
  shipment,
  ownedBy,
});

orderItem.define({
  batches: [batch],
  ownedBy,
});

order.define({
  orderItems: [orderItem],
  shipments: [shipment],
  containers: [container],
  ownedBy,
});

shipment.define({
  batches: [batch],
  ownedBy,
});

export default memoize(originalData => {
  const { entities } = normalize(originalData, { orders: [order] });
  return entities;
}, isDeepEqual);
