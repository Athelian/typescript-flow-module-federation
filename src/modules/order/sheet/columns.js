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
    exportKey: 'createdAt',
    title: <FormattedMessage {...orderMessages.createdAt} />,
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
    title: <FormattedMessage {...orderMessages.updatedAt} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 110,
    sort: {
      default: true,
      name: 'updatedAt',
      group: 'order',
    },
  },
  {
    key: 'order.archived',
    exportKey: 'archived',
    title: <FormattedMessage {...orderMessages.status} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 120,
  },
  {
    key: 'order.poNo',
    exportKey: 'poNo',
    title: <FormattedMessage {...orderMessages.PO} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
    sort: {
      name: 'poNo',
      group: 'order',
    },
  },
  {
    key: 'order.inCharges',
    exportKey: 'inCharges',
    title: <FormattedMessage {...orderMessages.inCharge} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  // importer
  // exporter
  {
    key: 'order.piNo',
    exportKey: 'piNo',
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
    exportKey: 'issuedAt',
    title: <FormattedMessage {...orderMessages.date} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 140,
  },
  {
    key: 'order.deliveryDate',
    exportKey: 'deliveryDate',
    title: <FormattedMessage {...orderMessages.deliveryDate} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 140,
  },
  {
    key: 'order.currency',
    title: <FormattedMessage {...orderMessages.currency} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 100,
    sort: {
      name: 'currency',
      group: 'order',
    },
  },
  {
    key: 'order.incoterm',
    title: <FormattedMessage {...orderMessages.incoterm} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 100,
  },
  {
    key: 'order.deliveryPlace',
    exportKey: 'deliveryPlace',
    title: <FormattedMessage {...orderMessages.deliveryPlace} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'order.tags',
    exportKey: 'tags',
    title: <FormattedMessage {...orderMessages.tags} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  {
    key: 'order.memo',
    exportKey: 'memo',
    title: <FormattedMessage {...orderMessages.memo} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  // in charge
  {
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
  },
  // {
  //   key: 'order.totalPrice',
  //   title: <FormattedMessage {...orderMessages.totalPrice} />,
  //   icon: 'ORDER',
  //   color: colors.ORDER,
  //   width: 200,
  // },
  {
    key: 'order.files',
    title: <FormattedMessage {...orderMessages.sectionDocuments} />,
    icon: 'ORDER',
    color: colors.ORDER,
    width: 200,
  },
  // tasks
  // custom fields mask
  // custom fields
  // actions
];

const orderItemColumns: Array<ColumnConfig> = [
  {
    key: 'order.orderItem.created',
    exportKey: 'orderItems.createdAt',
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
  {
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
  },
  {
    key: 'order.orderItem.archived',
    exportKey: 'orderItems.archived',
    title: <FormattedMessage {...orderItemMessages.status} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 105,
  },
  {
    key: 'order.orderItem.productProvider.product.name',
    title: <FormattedMessage id="components.BatchItem.productName" />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
    sort: {
      local: true,
      name: 'productProvider.product.name',
      group: 'orderItem',
    },
  },
  {
    key: 'order.orderItem.productProvider.product.serial',
    title: <FormattedMessage id="components.BatchItem.productSerial" />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
    sort: {
      local: true,
      name: 'productProvider.product.serial',
      group: 'orderItem',
    },
  },
  {
    key: 'order.orderItem.no',
    exportKey: 'orderItems.no',
    title: <FormattedMessage {...orderItemMessages.no} />,
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
    exportKey: 'orderItems.quantity',
    title: <FormattedMessage {...batchMessages.quantity} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
    sort: {
      local: true,
      name: 'quantity',
      group: 'orderItem',
    },
  },
  {
    key: 'order.orderItem.price',
    exportKey: 'orderItems.price',
    title: <FormattedMessage {...orderItemMessages.unitPrice} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
    sort: {
      local: true,
      name: 'price',
      group: 'orderItem',
    },
  },
  {
    key: 'order.orderItem.tags',
    title: <FormattedMessage {...orderItemMessages.tags} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  // memo
  {
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
  },
  {
    key: 'order.orderItem.deliveryDate',
    exportKey: 'orderItems.deliveryDate',
    title: <FormattedMessage {...orderItemMessages.deliveryDate} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 140,
    sort: {
      local: true,
      name: 'deliveryDate',
      group: 'orderItem',
    },
  },
  // total price
  {
    key: 'order.orderItem.files',
    title: <FormattedMessage {...orderMessages.sectionDocuments} />,
    icon: 'ORDER_ITEM',
    color: colors.ORDER_ITEM,
    width: 200,
  },
  // tasks
  // custom fields mask
  // custom fields
  // actions
];

const batchColumns: Array<ColumnConfig> = [
  {
    key: 'order.orderItem.batch.created',
    exportKey: 'orderItems.batches.createdAt',
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
  {
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
  },
  {
    key: 'order.orderItem.batch.archived',
    exportKey: 'orderItems.batches.archived',
    title: <FormattedMessage {...orderItemMessages.status} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 105,
  },
  {
    key: 'order.orderItem.batch.no',
    exportKey: 'orderItems.batches.no',
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
    exportKey: 'orderItems.batches.deliveredAt',
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
    exportKey: 'orderItems.batches.desiredAt',
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
    exportKey: 'orderItems.batches.expiredAt',
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
    exportKey: 'orderItems.batches.producedAt',
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
  {
    key: 'order.orderItem.batch.tags',
    title: <FormattedMessage {...batchMessages.tags} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
  },
  // memo
  {
    key: 'order.orderItem.batch.quantity',
    exportKey: 'orderItems.batches.quantity',
    title: <FormattedMessage {...batchMessages.initialQuantity} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 200,
    sort: {
      local: true,
      name: 'quantity',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.quantityRevisions',
    exportKey: 'orderItems.batches.quantityRevisions',
    title: <FormattedMessage {...batchMessages.sectionAdjustments} />,
    icon: 'BATCH',
    color: colors.BATCH,
    width: 1035,
  },
  {
    key: 'order.orderItem.batch.packageName',
    exportKey: 'orderItems.batches.packageName',
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
    exportKey: 'orderItems.batches.packageCapacity',
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
  {
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
  },
  {
    key: 'order.orderItem.batch.container.archived',
    exportKey: 'orderItems.batches.container.archived',
    title: <FormattedMessage {...containerMessages.status} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 105,
  },
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
  {
    key: 'order.orderItem.batch.container.containerType',
    title: <FormattedMessage {...containerMessages.containerType} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.container.containerOption',
    title: <FormattedMessage {...containerMessages.containerOption} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
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
  {
    key: 'order.orderItem.batch.container.warehouseArrivalAgreedDateAssignedTo',
    title: <FormattedMessage {...containerMessages.warehouseArrivalAgreedDateAssignedTo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
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
  {
    key: 'order.orderItem.batch.container.warehouseArrivalActualDateAssignedTo',
    title: <FormattedMessage {...containerMessages.warehouseArrivalActualDateAssignedTo} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
  // actual arrival approval
  // free time
  // start date
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
  {
    key: 'order.orderItem.batch.container.tags',
    title: <FormattedMessage {...containerMessages.tags} />,
    icon: 'CONTAINER',
    color: colors.CONTAINER,
    width: 200,
  },
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
    exportKey: 'orderItems.batches.shipment.createdAt',
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
  {
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
  },
  // archived
  {
    key: 'order.orderItem.batch.shipment.archived',
    exportKey: 'orderItems.batches.shipment.archived',
    title: <FormattedMessage {...shipmentMessages.status} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 120,
  },
  {
    key: 'order.orderItem.batch.shipment.no',
    exportKey: 'orderItems.batches.shipment.no',
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
  {
    key: 'order.orderItem.batch.shipment.inCharges',
    exportKey: 'orderItems.batches.shipment.inCharges',
    title: <FormattedMessage {...shipmentMessages.inCharge} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  // importer
  // exporter
  // forwarders
  // related exporters
  {
    key: 'order.orderItem.batch.shipment.blNo',
    exportKey: 'orderItems.batches.shipment.blNo',
    title: <FormattedMessage {...shipmentMessages.blNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
    sort: {
      local: true,
      name: 'shipmentBlNo',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.shipment.blDate',
    exportKey: 'orderItems.batches.shipment.blDate',
    title: <FormattedMessage {...shipmentMessages.blDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 140,
    sort: {
      local: true,
      name: 'shipmentBlDate',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.shipment.bookingNo',
    exportKey: 'orderItems.batches.shipment.bookingNo',
    title: <FormattedMessage {...shipmentMessages.bookingNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
    sort: {
      local: true,
      name: 'shipmentBookingNo',
      group: 'batch',
    },
  },
  // booked
  {
    key: 'order.orderItem.batch.shipment.bookingDate',
    exportKey: 'orderItems.batches.shipment.bookingDate',
    title: <FormattedMessage {...shipmentMessages.bookingDate} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 140,
    sort: {
      local: true,
      name: 'shipmentBookingDate',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.shipment.invoiceNo',
    exportKey: 'orderItems.batches.shipment.invoiceNo',
    title: <FormattedMessage {...shipmentMessages.invoiceNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
    sort: {
      local: true,
      name: 'shipmentInvoiceNo',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.shipment.contractNo',
    exportKey: 'orderItems.batches.shipment.contractNo',
    title: <FormattedMessage {...shipmentMessages.contractNo} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
    sort: {
      local: true,
      name: 'shipmentContractNo',
      group: 'batch',
    },
  },
  {
    key: 'order.orderItem.batch.shipment.transportType',
    exportKey: 'orderItems.batches.shipment.transportType',
    title: <FormattedMessage {...shipmentMessages.transportType} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.shipment.loadType',
    exportKey: 'orderItems.batches.shipment.loadType',
    title: <FormattedMessage {...shipmentMessages.loadType} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.shipment.incoterm',
    exportKey: 'orderItems.batches.shipment.incoterm',
    title: <FormattedMessage {...shipmentMessages.incoterms} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.shipment.carrier',
    exportKey: 'orderItems.batches.shipment.carrier',
    title: <FormattedMessage {...shipmentMessages.carrier} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
    sort: {
      local: true,
      name: 'shipmentCarrier',
      group: 'batch',
    },
  },
  // tags
  // memo
  // in charges
  // nb of voyages
  // cargo ready date
  // cargo ready date revisions
  // cargo ready assigned to
  // cargo ready approval
  {
    key: 'order.orderItem.batch.shipment.tags',
    title: <FormattedMessage {...shipmentMessages.tags} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
  },
  {
    key: 'order.orderItem.batch.shipment.cargoReady.date',
    exportKey: 'orderItem.batch.shipment.cargoReady.date',
    title: <FormattedMessage {...shipmentMessages.cargoReady} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 140,
  },
  {
    key: 'order.orderItem.batch.shipment.cargoReady.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.cargoReadyRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  {
    key: 'order.orderItem.batch.shipment.containerGroups.customClearance.date',
    exportKey: 'orderItem.batch.shipment.containerGroups.customClearance.date',
    title: <FormattedMessage {...shipmentMessages.customClearance} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 140,
  },
  {
    key: 'order.orderItem.batch.shipment.containerGroups.customClearance.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.customClearanceRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  /* {
    key: 'order.orderItem.batch.shipment.containerGroups.warehouseArrival.date',
    exportKey: 'orderItem.batch.shipment.containerGroups.warehouseArrival.date',
    title: <FormattedMessage {...shipmentMessages.warehouseArrival} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 140,
  },
  {
    key: 'order.orderItem.batch.shipment.containerGroups.warehouseArrival.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.warehouseArrivalRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  }, */
  {
    key: 'order.orderItem.batch.shipment.containerGroups.deliveryReady.date',
    exportKey: 'orderItem.batch.shipment.containerGroups.deliveryReady.date',
    title: <FormattedMessage {...shipmentMessages.deliveryReady} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 140,
  },
  {
    key: 'order.orderItem.batch.shipment.containerGroups.deliveryReady.timelineDateRevisions',
    title: <FormattedMessage {...shipmentMessages.deliveryReadyRevisions} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 1210,
  },
  {
    key: 'order.orderItem.batch.shipment.files',
    title: <FormattedMessage {...orderMessages.sectionDocuments} />,
    icon: 'SHIPMENT',
    color: colors.SHIPMENT,
    width: 200,
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
