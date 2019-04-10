import { normalize, schema } from 'normalizr';

const product = new schema.Entity('products');
const batch = new schema.Entity('batches');
const orderItem = new schema.Entity('orderItems');
const shipment = new schema.Entity('shipments');
const order = new schema.Entity('orders');

batch.define({
  orderItem,
  shipment,
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
});

export default originalData =>
  normalize(originalData, {
    orders: [order],
    shipments: [shipment],
    orderItems: [orderItem],
    batches: [batch],
    products: [product],
  });
