// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  // fields
  batchNo: {
    id: 'components.BatchItem.batchNo',
    defaultMessage: 'Batch No.',
  },
  currentQuantity: {
    id: 'components.BatchItem.currentQuantity',
    defaultMessage: 'Current Quantity',
  },
  quantity: {
    id: 'components.BatchItem.quantity',
    defaultMessage: 'QUANTITY',
  },
  initialQuantity: {
    id: 'components.BatchItem.initialQuantity',
    defaultMessage: 'INITIAL QUANTITY',
  },
  producedQuantity: {
    id: 'components.BatchItem.producedQuantity',
    defaultMessage: 'PRODUCED QUANTITY',
  },
  preShippedQuantity: {
    id: 'components.BatchItem.preShippedQuantity',
    defaultMessage: 'PRE-SHIPPED QUANTITY',
  },
  shippedQuantity: {
    id: 'components.BatchItem.shippedQuantity',
    defaultMessage: 'SHIPPED QUANTITY',
  },
  postShippedQuantity: {
    id: 'components.BatchItem.postShippedQuantity',
    defaultMessage: 'POST SHIPPED QUANTITY',
  },
  deliveredQuantity: {
    id: 'components.BatchItem.deliveredQuantity',
    defaultMessage: 'DELIVERED QUANTITY',
  },
  shortQuantity: {
    id: 'components.BatchItem.shortQuantity',
    defaultMessage: 'QTY',
  },
  inventory: {
    id: 'components.BatchItem.inventory',
    defaultMessage: 'INVENTORY',
  },
  user: {
    id: 'components.BatchItem.user',
    defaultMessage: 'STAFF',
  },
  memo: {
    id: 'components.BatchItem.memo',
    defaultMessage: 'MEMO',
  },
  product: {
    id: 'components.BatchItem.product',
    defaultMessage: 'PRODUCT',
  },
  batchItem: {
    id: 'components.BatchItem.batchItem',
    defaultMessage: 'BATCH ITEM',
  },
  orderItem: {
    id: 'components.BatchItem.orderItem',
    defaultMessage: 'ORDER ITEM',
  },
  order: {
    id: 'components.BatchItem.order',
    defaultMessage: 'ORDER',
  },
  shipment: {
    id: 'components.BatchItem.shipment',
    defaultMessage: 'SHIPMENT',
  },
  batchGroup: {
    id: 'components.BatchItem.batchGroup',
    defaultMessage: 'BATCH GROUP',
  },
  tags: {
    id: 'components.BatchItem.tags',
    defaultMessage: 'TAGS',
  },
  poNo: {
    id: 'components.BatchItem.poNo',
    defaultMessage: 'PO No.',
  },
  packageName: {
    id: 'components.BatchItem.packageName',
    defaultMessage: 'PACKAGE NAME',
  },
  packageCapacity: {
    id: 'components.BatchItem.packageCapacity',
    defaultMessage: 'PACKAGE CAPACITY',
  },
  packageQuantity: {
    id: 'components.BatchItem.packageQuantity',
    defaultMessage: 'PACKAGE QUANTITY',
  },
  autoCalculatePackageQuantity: {
    id: 'components.BatchItem.autoCalculatePackageQuantity',
    defaultMessage: 'AUTO CALCULATE PACKAGE QUANTITY',
  },
  packageGrossWeight: {
    id: 'components.BatchItem.packageGrossWeight',
    defaultMessage: 'PACKAGE GROSS WEIGHT',
  },
  packageVolume: {
    id: 'components.BatchItem.packageVolume',
    defaultMessage: 'PACKAGE GROSS VOLUME',
  },
  packageMaxQuantity: {
    id: 'components.BatchItem.packageMaxQuantity',
    defaultMessage: 'MAX QUANTITY / PACKAGE',
  },
  packageSize: {
    id: 'components.BatchItem.packageSize',
    defaultMessage: 'PACKAGE SIZE (m)',
  },
  packageSizeGrouped: {
    id: 'components.BatchItem.packageSizeGrouped',
    defaultMessage: 'PACKAGE SIZE (L x H x D)',
  },
  productName: {
    id: 'components.BatchItem.productName',
    defaultMessage: 'Product Name',
  },
  productSerial: {
    id: 'components.BatchItem.productSerial',
    defaultMessage: 'Product Serial',
  },
  deliveredAt: {
    id: 'components.BatchItem.deliveredAt',
    defaultMessage: 'Delivery Date',
  },
  desiredAt: {
    id: 'components.BatchItem.desiredAt',
    defaultMessage: 'DESIRED DATE',
  },
  shortDeliveryAt: {
    id: 'components.BatchItem.shortDeliveryAt',
    defaultMessage: 'DELIVERY',
  },
  expiredAt: {
    id: 'components.BatchItem.expiredAt',
    defaultMessage: 'Expiry Date',
  },
  producedAt: {
    id: 'components.BatchItem.producedAt',
    defaultMessage: 'Production Date',
  },
  updatedAt: {
    id: 'components.BatchItem.updatedAt',
    defaultMessage: 'Last Modified',
  },
  sort: {
    id: 'components.BatchItem.sort',
    defaultMessage: 'Date Added',
  },
  createdAt: {
    id: 'components.BatchItem.createdAt',
    defaultMessage: 'Date Created',
  },
  adjustmentType: {
    id: 'components.BatchItem.adjustmentType',
    defaultMessage: 'CATEGORY',
  },
  importer: {
    id: 'components.BatchItem.importer',
    defaultMessage: 'IMPORTER',
  },
  exporter: {
    id: 'components.BatchItem.exporter',
    defaultMessage: 'EXPORTER',
  },
  supplier: {
    id: 'components.BatchItem.supplier',
    defaultMessage: 'SUPPLIER',
  },
  status: {
    id: 'components.BatchItem.status',
    defaultMessage: 'STATUS',
  },
  // sections
  sectionBatch: {
    id: 'components.BatchItem.sectionBatch',
    defaultMessage: 'BATCH',
  },
  sectionLinks: {
    id: 'components.BatchItem.sectionLinks',
    defaultMessage: 'LINKS',
  },
  sectionDates: {
    id: 'components.BatchItem.sectionDates',
    defaultMessage: 'DATES',
  },
  sectionPackage: {
    id: 'components.BatchItem.sectionPackage',
    defaultMessage: 'PACKAGING',
  },
  sectionAssignments: {
    id: 'components.BatchItem.sectionAssignments',
    defaultMessage: 'ASSIGNMENTS',
  },
  // tooltips
  tooltipDetails: {
    id: 'components.BatchItem.tooltip.details',
    defaultMessage: 'View Batch Details',
  },
  tooltipJumpProduct: {
    id: 'components.BatchItem.tooltip.jumpProduct',
    defaultMessage: 'View Product Details',
  },
  tooltipJumpOrder: {
    id: 'components.BatchItem.tooltip.jumpOrder',
    defaultMessage: 'View Order Details',
  },
  tooltipJumpBatchGroup: {
    id: 'components.BatchItem.tooltip.jumpBatchGroup',
    defaultMessage: 'View Batch Group Details',
  },
  tooltipJumpShipment: {
    id: 'components.BatchItem.tooltip.jumpShipment',
    defaultMessage: 'View Shipment Details',
  },
  tooltipProduct: {
    id: 'components.BatchItem.tooltip.product',
    defaultMessage: '[Product] {product}',
  },
  tooltipSerial: {
    id: 'components.BatchItem.tooltip.serial',
    defaultMessage: '[Serial] {serial}',
  },
  tooltipNo: {
    id: 'components.BatchItem.tooltip.no',
    defaultMessage: '[Batch ID] {no}',
  },
  tooltipPO: {
    id: 'components.BatchItem.tooltip.PO',
    defaultMessage: '[PO] {PO}',
  },
  tooltipBatchGroupNo: {
    id: 'components.BatchItem.tooltip.batchGroupNo',
    defaultMessage: '[Batch Group Serial] {no}',
  },
  tooltipShipmentNo: {
    id: 'components.BatchItem.tooltip.shipmentNo',
    defaultMessage: '[Shipment ID] {no}',
  },
  tooltipQuantity: {
    id: 'components.BatchItem.tooltip.quantity',
    defaultMessage: '[Quantity] {quantity}',
  },
  tooltipDelivery: {
    id: 'components.BatchItem.tooltip.delivery',
    defaultMessage: '[Delivery Date] {delivery}',
  },
  tooltipTask: {
    id: 'components.BatchItem.tooltip.task',
    defaultMessage:
      '{title} approved by {approvedByFirstName} {approvedByLastName} on {approvedAt}',
  },
  tooltipAssignments: {
    id: 'components.BatchItem.tooltip.assignments',
    defaultMessage: 'View Assignments',
  },
  tooltipExporter: {
    id: 'components.BatchItem.tooltip.exporter',
    defaultMessage: '[Exporter] {exporter}',
  },
  tooltipNotSelectable: {
    id: 'components.BatchItem.tooltip.notSelectable',
    defaultMessage: 'This batch is already in a batch group',
  },
  tooltipExporterError: {
    id: 'components.BatchItem.tooltip.exporterError',
    defaultMessage: 'This batch has a different exporter from the others',
  },
  // validations
  required: {
    id: 'components.BatchItem.validation.required',
    defaultMessage: 'Required',
  },
  duplicateBatchItem: {
    id: 'components.BatchItem.validation.duplicateBatchItem',
    defaultMessage: 'Duplicate batch item',
  },
  // actions
  assignMe: {
    id: 'components.BatchItem.assignMe',
    defaultMessage: 'Assign someone',
  },
  addAssign: {
    id: 'components.BatchItem.addAssign',
    defaultMessage: 'ADD ASSIGNMENT',
  },
  addAdjustment: {
    id: 'components.BatchItem.addAdjustment',
    defaultMessage: 'ADD ADJUSTMENT',
  },
  save: {
    id: 'components.BatchItem.save',
    defaultMessage: 'SAVE',
  },
  cancel: {
    id: 'components.BatchItem.cancel',
    defaultMessage: 'CANCEL',
  },
  selectNoneRequest: {
    id: 'components.BatchItem.selectNoneRequest',
    defaultMessage: 'Select None.',
  },
  // other
  datePlaceholder: {
    id: 'components.BatchItem.datePlaceholder',
    defaultMessage: 'MM/DD/YYYY',
  },
  noShipmentID: {
    id: 'components.BatchItem.noShipmentID',
    defaultMessage: 'No Shipment ID',
  },
  hasShipment: {
    id: 'components.BatchItem.hasShipment',
    defaultMessage: 'Has Shipment',
  },
  totalPrice: {
    id: 'components.BatchItem.totalPrice',
    defaultMessage: 'TOTAL PRICE',
  },
  totalVolume: {
    id: 'components.BatchItem.totalVolume',
    defaultMessage: 'TOTAL VOLUME',
  },
  active: {
    id: 'components.BatchItem.active',
    defaultMessage: 'ACTIVE',
  },
  completed: {
    id: 'components.BatchItem.completed',
    defaultMessage: 'COMPLETED',
  },
  tasks: {
    id: 'components.BatchItem.tasks',
    defaultMessage: 'Tasks',
  },
  logs: {
    id: 'components.BatchItem.logs',
    defaultMessage: 'Logs',
  },
  mask: {
    id: 'components.BatchItem.mask',
    defaultMessage: 'Custom fields template',
  },
});
