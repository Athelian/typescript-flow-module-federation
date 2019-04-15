import { normalize, schema } from 'normalizr';

const product = new schema.Entity('products');
const batch = new schema.Entity('batches');
const orderItem = new schema.Entity('orderItems');
const shipment = new schema.Entity('shipments');
const order = new schema.Entity('orders');
const container = new schema.Entity('containers');

batch.define({
  orderItem,
  shipment,
  container,
});

orderItem.define({
  order,
  batches: [batch],
  productProvider: { product },
});

order.define({
  orderItems: [orderItem],
  shipments: [shipment],
});

shipment.define({
  batches: [batch],
  containers: [container],
});

export default originalData =>
  normalize(originalData, {
    orders: [order],
    shipments: [shipment],
    orderItems: [orderItem],
    batches: [batch],
    products: [product],
    containers: [container],
  });
