import { normalize, schema } from 'normalizr';

const batch = new schema.Entity('batches');
const exporter = new schema.Entity('exporters');
const orderItem = new schema.Entity('orderItems');
const shipment = new schema.Entity('shipments');
const order = new schema.Entity('orders');

batch.define({
  orderItem,
});

orderItem.define({
  order,
  productProvider: {
    exporter,
  },
  batches: [batch],
});

order.define({
  exporter,
  orderItems: [orderItem],
  shipments: [shipment],
});

shipment.define({
  batches: [batch],
});

export default originalData => normalize(originalData, { orders: [order] });
