import { normalize, schema } from 'normalizr';
import memoize from 'memoize-one';
import isDeepEqual from 'lodash.isequal';

const batch = new schema.Entity('batches');
const container = new schema.Entity('containers');
const orderItem = new schema.Entity('orderItems');
const shipment = new schema.Entity('shipments');
const order = new schema.Entity('orders');

batch.define({
  shipment,
  container,
});

container.define({
  shipment,
});

orderItem.define({
  batches: [batch],
});

order.define({
  orderItems: [orderItem],
  shipments: [shipment],
  containers: [container],
});

shipment.define({
  batches: [batch],
});

export default memoize(originalData => {
  const { entities } = normalize(originalData, { orders: [order] });
  return entities;
}, isDeepEqual);
