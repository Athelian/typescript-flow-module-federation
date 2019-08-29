// @flow

const columns = [
  {
    key: 'order.poNo',
    title: 'PO No',
    width: 200,
  },
  {
    key: 'order.currency',
    title: 'Currency',
    width: 100,
  },
  {
    key: 'order.orderItem.no',
    title: 'Item No',
    width: 200,
  },
  /* {
    key: 'order.orderItem.quantity',
    title: 'Quantity',
    width: 200,
  }, */
  {
    key: 'order.orderItem.batch.no',
    title: 'Batch No',
    width: 200,
  },
  /* {
    key: 'order.orderItem.batch.quantity',
    title: 'Quantity',
    width: 200,
  }, */
  {
    key: 'order.orderItem.batch.container.no',
    title: 'Container No',
    width: 200,
  },
  {
    key: 'order.orderItem.batch.shipment.no',
    title: 'Shipment No',
    width: 200,
  },
];

export default columns;
