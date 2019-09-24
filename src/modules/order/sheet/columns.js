// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { colors } from 'styles/common';
import type { ColumnConfig } from 'components/Sheet';
import orderMessages from 'modules/order/messages';
import orderItemMessages from 'modules/orderItem/messages';
import batchMessages from 'modules/batch/messages';
import containerMessages from 'modules/container/messages';
import shipmentMessages from 'modules/shipment/messages';

const orderColumns: Array<ColumnConfig> = [
  {
    key: 'order.created',
    title: <FormattedMessage {...orderMessages.createdAt} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 110,
    sort: {
      name: 'createdAt',
      group: 'order',
    },
  },
  /* {
    key: 'order.updated',
    title: <FormattedMessage {...orderMessages.updatedAt} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 110,
    sort: {
      default: true,
      name: 'updatedAt',
      group: 'order',
    },
  }, */
  // status
  {
    key: 'order.poNo',
    title: <FormattedMessage {...orderMessages.PO} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
    sort: {
      name: 'poNo',
      group: 'order',
    },
  },
  // importer
  // exporter
  {
    key: 'order.piNo',
    title: <FormattedMessage {...orderMessages.PI} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
    sort: {
      name: 'piNo',
      group: 'order',
    },
  },
  {
    key: 'order.issuedAt',
    title: <FormattedMessage {...orderMessages.date} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 140,
  },
  {
    key: 'order.deliveryDate',
    title: <FormattedMessage {...orderMessages.deliveryDate} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 140,
  },
  /* {
    key: 'order.currency',
    title: <FormattedMessage {...orderMessages.currency} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 100,
    sort: {
      name: 'currency',
      group: 'order',
    },
  }, */
  /* {
    key: 'order.incoterm',
    title: <FormattedMessage {...orderMessages.incoterm} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 100,
  }, */
  {
    key: 'order.deliveryPlace',
    title: <FormattedMessage {...orderMessages.deliveryPlace} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  // tags
  // memo
  // in charge
  /* {
    key: 'order.totalOrdered',
    title: <FormattedMessage {...orderMessages.totalOrderedQuantity} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'order.totalBatched',
    title: <FormattedMessage {...orderMessages.totalBatchedQuantity} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'order.totalShipped',
    title: <FormattedMessage {...orderMessages.totalShippedQuantity} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  }, */
  // total price
  // documents
  // tasks
  // custom fields mask
  // custom fields
  // actions
];

const orderItemColumns: Array<ColumnConfig> = [
  {
    key: 'order.orderItem.created',
    title: <FormattedMessage {...orderItemMessages.createdAt} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 110,
    sort: {
      local: true,
      default: true,
      name: 'createdAt',
      group: 'orderItem',
    },
  },
  /* {
    key: 'order.orderItem.updated',
    title: <FormattedMessage {...orderItemMessages.updatedAt} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 110,
    sort: {
      local: true,
      name: 'updatedAt',
      group: 'orderItem',
    },
  }, */
  // status
  {
    key: 'order.orderItem.no',
    title: 'Item No',
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
    sort: {
      local: true,
      name: 'no',
      group: 'orderItem',
    },
  },
  {
    key: 'order.orderItem.quantity',
    title: 'Quantity',
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
    sort: {
      local: true,
      name: 'quantity',
      group: 'orderItem',
    },
  },
  // price
  // tags
  // memo
  /* {
    key: 'order.orderItem.totalBatched',
    title: 'Total Batched quantity',
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
    sort: {
      local: true,
      name: 'totalBatched',
      group: 'orderItem',
    },
  },
  {
    key: 'order.orderItem.totalShipped',
    title: 'Total Shipped Quantity',
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
    sort: {
      local: true,
      name: 'totalShipped',
      group: 'orderItem',
    },
  }, */
  // total price
  // documents
  // tasks
  // custom fields mask
  // custom fields
  // actions
];

const batchColumns: Array<ColumnConfig> = [
  {
    key: 'order.orderItem.batch.created',
    title: <FormattedMessage {...batchMessages.createdAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 110,
    sort: {
      local: true,
      default: true,
      name: 'createdAt',
      group: 'batch',
    },
  },
  /* {
    key: 'order.orderItem.batch.updated',
    title: <FormattedMessage {...batchMessages.updatedAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 110,
    sort: {
      local: true,
      name: 'updatedAt',
      group: 'batch',
    },
  }, */
  // status
  {
    key: 'order.orderItem.batch.no',
    title: <FormattedMessage {...batchMessages.batchNo} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'no',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.deliveredAt',
    title: <FormattedMessage {...batchMessages.deliveredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 140,
    sort: {
      local: true,
      name: 'deliveredAt',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.desiredAt',
    title: <FormattedMessage {...batchMessages.desiredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 140,
    sort: {
      local: true,
      name: 'desiredAt',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.expiredAt',
    title: <FormattedMessage {...batchMessages.expiredAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 140,
    sort: {
      local: true,
      name: 'expiredAt',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.producedAt',
    title: <FormattedMessage {...batchMessages.producedAt} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 140,
    sort: {
      local: true,
      name: 'producedAt',
      group: 'batch',
    },
  },
  // tags
  // memo
  {
    key: 'order.orderItem.batch.quantity',
    title: <FormattedMessage {...batchMessages.quantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'quantity',
      group: 'batch',
    },
  },
  // revised quantities
  {
    key: 'order.orderItem.batch.packageName',
    title: <FormattedMessage {...batchMessages.packageName} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'packageName',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.packageCapacity',
    title: <FormattedMessage {...batchMessages.packageCapacity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'packageCapacity',
      group: 'batch',
    },
  },
  /* {
    key: 'order.orderItem.batch.packageQuantity',
    title: <FormattedMessage {...batchMessages.packageQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'packageQuantity',
      group: 'batch',
    },
  }, */
  // pkg auto qty
  // pkg weight
  // pkg vol
  // pkg auto vol
  // pkg size
  // tasks
  // custom fields mask
  // custom fields
  // actions
];

const containerColumns: Array<ColumnConfig> = [
  {
    key: 'order.orderItem.batch.container.created',
    title: <FormattedMessage {...containerMessages.createdAt} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
    sort: {
      local: true,
      name: 'containerCreatedAt',
      group: 'batch',
    },
  },
  /* {
    key: 'order.orderItem.batch.container.updated',
    title: <FormattedMessage {...containerMessages.updatedAt} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
    sort: {
      local: true,
      name: 'containerUpdatedAt',
      group: 'batch',
    },
  }, */
  // status
  {
    key: 'order.orderItem.batch.container.no',
    title: <FormattedMessage {...containerMessages.containerNo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
    sort: {
      local: true,
      name: 'containerNo',
      group: 'batch',
    },
  },
  // ctn type
  // ctn option
  {
    key: 'order.orderItem.batch.container.warehouseArrivalAgreedDate',
    title: <FormattedMessage {...containerMessages.warehouseArrivalAgreedDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 170,
    sort: {
      local: true,
      name: 'containerWarehouseArrivalAgreedDate',
      group: 'batch',
    },
  },
  // agreed arrival assigned to
  // agreed arrival approval
  {
    key: 'order.orderItem.batch.container.warehouseArrivalActualDate',
    title: <FormattedMessage {...containerMessages.warehouseArrivalActualDate} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 170,
    sort: {
      local: true,
      name: 'containerWarehouseArrivalActualDate',
      group: 'batch',
    },
  },
  // actual arrival assigned to
  // actual arrival approval
  // free time
  {
    key: 'order.orderItem.batch.container.freeTimeStartDate',
    title: 'Start Date',
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 140,
    sort: {
      local: true,
      name: 'containerFreeTimeStartDate',
      group: 'batch',
    },
  },
  // start date auto
  // duration
  // due date
  {
    key: 'order.orderItem.batch.container.yardName',
    title: 'Yard Name',
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
    sort: {
      local: true,
      name: 'containerYardName',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.container.departureDate',
    title: 'Yard Departure Date',
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 140,
    sort: {
      local: true,
      name: 'containerDepartureDate',
      group: 'batch',
    },
  },
  // departure assigned to
  // departure approval
  // tags
  // memo
  {
    key: 'order.orderItem.batch.container.totalPackageQuantity',
    title: <FormattedMessage {...containerMessages.totalPackages} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
    sort: {
      local: true,
      name: 'containerTotalPackageQuantity',
      group: 'batch',
    },
  },
  /* {
    key: 'order.orderItem.batch.container.totalQuantity',
    title: <FormattedMessage {...containerMessages.totalBatchQuantity} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
    sort: {
      local: true,
      name: 'containerTotalQuantity',
      group: 'batch',
    },
  }, */
  {
    key: 'order.orderItem.batch.container.orderItemCount',
    title: <FormattedMessage {...containerMessages.totalUniqueItems} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
    sort: {
      local: true,
      name: 'containerOrderItemCount',
      group: 'batch',
    },
  },
  // total volume
  // total weight
  // total price
  // actions
];

const shipmentColumns: Array<ColumnConfig> = [
  {
    key: 'order.orderItem.batch.shipment.created',
    title: <FormattedMessage {...shipmentMessages.createdAt} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
    sort: {
      local: true,
      name: 'shipmentCreatedAt',
      group: 'batch',
    },
  },
  /* {
    key: 'order.orderItem.batch.shipment.updated',
    title: <FormattedMessage {...shipmentMessages.updatedAt} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
    sort: {
      local: true,
      name: 'shipmentUpdatedAt',
      group: 'batch',
    },
  }, */
  {
    key: 'order.orderItem.batch.shipment.no',
    title: <FormattedMessage {...shipmentMessages.shipmentId} />,
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

const columns: Array<ColumnConfig> = [
  ...orderColumns,
  ...orderItemColumns,
  ...batchColumns,
  ...containerColumns,
  ...shipmentColumns,
];

export default columns;