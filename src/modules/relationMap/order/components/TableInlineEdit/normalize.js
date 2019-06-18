import { normalize, schema } from 'normalizr';

const product = new schema.Entity('products');
const batch = new schema.Entity('batches');
const orderItem = new schema.Entity('orderItems');
const shipment = new schema.Entity('shipments');
const order = new schema.Entity('orders');
const container = new schema.Entity('containers');

orderItem.define({
  order,
  productProvider: { product },
});

batch.define({
  orderItem,
  container,
  mainShipment: shipment,
});

container.define({
  shipment,
});

export default originalData =>
  normalize(originalData, {
    orders: [order],
    shipments: [shipment],
    orderItems: [orderItem],
    batches: [batch],
    containers: [container],
  });
