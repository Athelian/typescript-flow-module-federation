// @flow
import { colors } from 'styles/common';

const columns = [
  {
    key: 'order.poNo',
    title: 'PO No',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'order.piNo',
    title: 'PI No',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'order.currency',
    title: 'Currency',
    color: colors.ORDER,
    width: 100,
  },
  {
    key: 'order.deliveryPlace',
    title: 'Place Of Delivery',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'order.orderItem.no',
    title: 'Item No',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  /* {
    key: 'order.orderItem.quantity',
    title: 'Quantity',
    color: colors.ORDER_ITEM,
    width: 200,
  }, */
  {
    key: 'order.orderItem.batch.no',
    title: 'Batch No',
    color: colors.BATCH,
    width: 200,
  },
  /* {
    key: 'order.orderItem.batch.quantity',
    title: 'Quantity',
    color: colors.BATCH,
    width: 200,
  }, */
  {
    key: 'order.orderItem.batch.container.no',
    title: 'Container No',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.shipment.no',
    title: 'Shipment No',
    color: colors.SHIPMENT,
    width: 200,
  },
];

export default columns;
