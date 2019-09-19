// @flow
import { colors } from 'styles/common';
import type { ColumnConfig } from 'components/Sheet';

const orderColumns: Array<ColumnConfig> = [
  {
    key: 'order.created',
    title: 'Date Created',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 110,
    sort: {
      name: 'createdAt',
      group: 'order',
    },
  },
  {
    key: 'order.updated',
    title: 'Last Modified',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 110,
    sort: {
      default: true,
      name: 'updatedAt',
      group: 'order',
    },
  },
  // status
  {
    key: 'order.poNo',
    title: 'PO No',
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
    title: 'PI No',
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
    title: 'PO Date',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 140,
  },
  {
    key: 'order.deliveryDate',
    title: 'Contract Delivery Date',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 140,
  },
  /* {
    key: 'order.currency',
    title: 'Currency',
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
    title: 'Incoterms',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 100,
  }, */
  {
    key: 'order.deliveryPlace',
    title: 'Place Of Delivery',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  // tags
  // memo
  // in charge
  {
    key: 'order.totalOrdered',
    title: 'Total Ordered quantity',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'order.totalBatched',
    title: 'Total Batched quantity',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'order.totalShipped',
    title: 'Total Shipped Quantity',
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
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
    title: 'Created',
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
  {
    key: 'order.orderItem.updated',
    title: 'Updated',
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 110,
    sort: {
      local: true,
      name: 'updatedAt',
      group: 'orderItem',
    },
  },
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
  {
    key: 'order.orderItem.totalBatched',
    title: 'Total Batched quantity',
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  {
    key: 'order.orderItem.totalShipped',
    title: 'Total Shipped Quantity',
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
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
    title: 'Created',
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
  {
    key: 'order.orderItem.batch.updated',
    title: 'Updated',
    icon: 'BATCH',
    color: colors.BATCH,
    width: 110,
    sort: {
      local: true,
      name: 'updatedAt',
      group: 'batch',
    },
  },
  // status
  {
    key: 'order.orderItem.batch.no',
    title: 'Batch No',
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
    title: 'Delivery Date',
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
    title: 'Desired Date',
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
    title: 'Expiry Date',
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
    title: 'Production Date',
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
    title: 'Quantity',
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
    title: 'Package Name',
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
    title: 'Package Capacity',
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'packageCapacity',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.packageQuantity',
    title: 'Package Quantity',
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'packageQuantity',
      group: 'batch',
    },
  },
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
    title: 'Created',
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
    sort: {
      local: true,
      name: 'containerCreatedAt',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.container.updated',
    title: 'Updated',
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 110,
    sort: {
      local: true,
      name: 'containerUpdatedAt',
      group: 'batch',
    },
  },
  // status
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
  // ctn type
  // ctn option
  {
    key: 'order.orderItem.batch.container.warehouseArrivalAgreedDate',
    title: 'Agreed Arrival Date',
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
    title: 'Actual Arrival Date',
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
    title: 'Total Packages',
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
    sort: {
      local: true,
      name: 'containerTotalPackageQuantity',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.container.totalQuantity',
    title: 'Total Batched Quantity',
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
    sort: {
      local: true,
      name: 'containerTotalQuantity',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.container.orderItemCount',
    title: 'Total Items',
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
    title: 'Created',
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
    sort: {
      local: true,
      name: 'shipmentCreatedAt',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.shipment.updated',
    title: 'Updated',
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 110,
    sort: {
      local: true,
      name: 'shipmentUpdatedAt',
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

const columns: Array<ColumnConfig> = [
  ...orderColumns,
  ...orderItemColumns,
  ...batchColumns,
  ...containerColumns,
  ...shipmentColumns,
];

export default columns;
