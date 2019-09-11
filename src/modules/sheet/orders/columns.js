// @flow
import { colors } from 'styles/common';
import type { ColumnConfig } from 'components/Sheet';

const columns: Array<ColumnConfig> = [
  {
    key: 'order.poNo',
    title: 'PO No',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
    sort: {
      local: false,
      name: 'poNo',
      group: 'order',
    },
  },
  {
    key: 'order.piNo',
    title: 'PI No',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
    sort: {
      local: false,
      name: 'piNo',
      group: 'order',
    },
  },
  {
    key: 'order.currency',
    title: 'Currency',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 100,
    sort: {
      local: false,
      name: 'currency',
      group: 'order',
    },
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
    sort: {
      local: true,
      name: 'orderItemNo',
      group: 'orderItem',
    },
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
    sort: {
      local: true,
      name: 'batchNo',
      group: 'batch',
    },
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
    sort: {
      local: true,
      name: 'containerNo',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.shipment.no',
    title: 'Shipment No',
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
    sort: {
      local: true,
      name: 'shipmentNo',
      group: 'batch',
    },
  },
];

export default columns;
