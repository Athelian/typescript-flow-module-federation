// @flow
import { colors } from 'styles/common';

const columns = [
  {
    key: 'order.poNo',
    title: 'PO No',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'order.piNo',
    title: 'PI No',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'order.currency',
    title: 'Currency',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 100,
  },
  {
    key: 'order.deliveryPlace',
    title: 'Place Of Delivery',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'order.orderItem.no',
    title: 'Item No',
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  /* {
    key: 'order.orderItem.quantity',
    title: 'Quantity',
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  }, */
  {
    key: 'order.orderItem.batch.no',
    title: 'Batch No',
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  /* {
    key: 'order.orderItem.batch.quantity',
    title: 'Quantity',
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  }, */
  {
    key: 'order.orderItem.batch.container.no',
    title: 'Container No',
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.shipment.no',
    title: 'Shipment No',
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
];

export default columns;
