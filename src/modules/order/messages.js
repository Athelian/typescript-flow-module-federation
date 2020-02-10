// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  order: {
    id: 'modules.Orders.order',
    defaultMessage: 'ORDER',
  },
  save: {
    id: 'modules.Orders.save',
    defaultMessage: 'SAVE',
  },
  cancel: {
    id: 'modules.Orders.cancel',
    defaultMessage: 'CANCEL',
  },
  active: {
    id: 'modules.Orders.active',
    defaultMessage: 'ACTIVE',
  },
  completed: {
    id: 'modules.Orders.completed',
    defaultMessage: 'COMPLETED',
  },
  newOrder: {
    id: 'modules.Orders.newOrder',
    defaultMessage: 'NEW',
  },
  noOrders: {
    id: 'modules.Orders.noOrders',
    defaultMessage: 'No orders found.',
  },
  noBatches: {
    id: 'modules.Orders.noBatches',
    defaultMessage: 'No batches found.',
  },
  noShipment: {
    id: 'modules.Orders.noShipment',
    defaultMessage: 'No shipment.',
  },
  tooltipNo: {
    id: 'modules.Orders.tooltip.no',
    defaultMessage: '[Batch ID] {no}',
  },
  tooltipDelivery: {
    id: 'modules.Orders.tooltip.delivery',
    defaultMessage: '[Delivery Date] {delivery}',
  },
  tooltipPO: {
    id: 'modules.Orders.tooltip.PO',
    defaultMessage: '[PO] {PO}',
  },
  tooltipPODate: {
    id: 'modules.Orders.tooltip.PODate',
    defaultMessage: '[PO Date] {date}',
  },
  tooltipOrderedQuantity: {
    id: 'modules.Orders.tooltip.orderedQuantity',
    defaultMessage: '[Total Ordered] {totalQuantity}',
  },
  tooltipBatchedQuantity: {
    id: 'modules.Orders.tooltip.batchedQuantity',
    defaultMessage: '[Total Batched] {totalBatchedQuantity}',
  },
  tooltipShippedQuantity: {
    id: 'modules.Orders.tooltip.shippedQuantity',
    defaultMessage: '[Total Shipped] {totalShippedQuantity}',
  },
  tooltipUnshippedQuantity: {
    id: 'modules.Orders.tooltip.unshippedQuantity',
    defaultMessage: '[Total Unshipped] {totalUnshippedQuantity}',
  },
  tooltipOpenChart: {
    id: 'modules.Orders.tooltip.openChart',
    defaultMessage: 'Show Items',
  },
  tooltipExporter: {
    id: 'modules.Orders.tooltip.exporter',
    defaultMessage: '[Exporter] {exporter}',
  },
  tooltipSupplier: {
    id: 'modules.Orders.tooltip.supplier',
    defaultMessage: '[Supplier] {supplier}',
  },
  tooltipProduct: {
    id: 'modules.Orders.tooltip.product',
    defaultMessage: '[Product] {product}',
  },
  tooltipSerial: {
    id: 'modules.Orders.tooltip.serial',
    defaultMessage: '[Serial] {serial}',
  },
  tooltipQuantity: {
    id: 'modules.Orders.tooltip.quantity',
    defaultMessage: '[Quantity] {quantity}',
  },
  tooltipPrice: {
    id: 'modules.Orders.tooltip.price',
    defaultMessage: '[Price] {currencyAndPrice}',
  },
  tooltipDetails: {
    id: 'modules.Orders.tooltip.details',
    defaultMessage: 'View Details',
  },
  PO: {
    id: 'modules.Orders.poNo',
    defaultMessage: 'PO NO.',
  },
  date: {
    id: 'modules.Orders.issuedAt',
    defaultMessage: 'PO Date',
  },
  deliveryDate: {
    id: 'modules.order.deliveryDate',
    defaultMessage: 'Contract Delivery Date',
  },
  PI: {
    id: 'modules.Orders.piNo',
    defaultMessage: 'PI NO.',
  },
  incoterm: {
    id: 'modules.Orders.incoterms',
    defaultMessage: 'Incoterms',
  },
  deliveryPlace: {
    id: 'modules.Orders.deliveryPlace',
    defaultMessage: 'Place of Delivery',
  },
  currency: {
    id: 'modules.Orders.currency',
    defaultMessage: 'Currency',
  },
  importer: {
    id: 'modules.Orders.importer',
    defaultMessage: 'IMPORTER',
  },
  exporter: {
    id: 'modules.Orders.exporter',
    defaultMessage: 'EXPORTER',
  },
  exporterName: {
    id: 'modules.Orders.exporterName',
    defaultMessage: 'Exporter',
  },
  exporterCode: {
    id: 'modules.Orders.exporterCode',
    defaultMessage: 'EXPORTER CODE',
  },
  forwarder: {
    id: 'modules.Orders.forwarder',
    defaultMessage: 'FORWARDER',
  },
  memo: {
    id: 'modules.Orders.memo',
    defaultMessage: 'MEMO',
  },
  batchMemo: {
    id: 'modules.Batches.memo',
    defaultMessage: 'MEMO',
  },
  createdAt: {
    id: 'modules.Orders.createdAt',
    defaultMessage: 'Date Created',
  },
  updatedAt: {
    id: 'modules.Orders.updatedAt',
    defaultMessage: 'Last Modified',
  },
  status: {
    id: 'modules.Orders.status',
    defaultMessage: 'STATUS',
  },
  productExporterSupplier: {
    id: 'modules.Orders.productExporterSupplier',
    defaultMessage: 'PRODUCT',
  },
  serial: {
    id: 'modules.Orders.serial',
    defaultMessage: 'SERIAL',
  },
  unit: {
    id: 'modules.Orders.unit',
    defaultMessage: 'UNIT TYPE',
  },
  price: {
    id: 'modules.Orders.price',
    defaultMessage: 'UNIT PRICE',
  },
  priceCurrency: {
    id: 'modules.Orders.priceCurrency',
    defaultMessage: 'Unit Price Currency',
  },
  itemPrice: {
    id: 'modules.OrderItems.price',
    defaultMessage: 'ORDER ITEM UNIT PRICE',
  },
  originalPrice: {
    id: 'modules.Orders.originalPrice',
    defaultMessage: 'ORIGINAL UNIT PRICE',
  },
  expiry: {
    id: 'modules.Orders.expiry',
    defaultMessage: 'EXPIRY DATE',
  },
  quantity: {
    id: 'modules.Orders.quantity',
    defaultMessage: 'QUANTITY',
  },
  itemQuantity: {
    id: 'modules.OrderItems.quantity',
    defaultMessage: 'ORDER ITEM QUANTITY',
  },
  batchQuantity: {
    id: 'modules.Orders.batchQuantity',
    defaultMessage: 'BATCH QUANTITY',
  },
  packageQuantity: {
    id: 'modules.Batches.packageQuantity',
    defaultMessage: 'PACKAGE QUANTITY',
  },
  shippedQuantity: {
    id: 'modules.Orders.shippedQuantity',
    defaultMessage: 'ALREADY CARGO READY QUANTITY',
  },
  batchedQuantity: {
    id: 'modules.Orders.batchedQuantity',
    defaultMessage: 'CURRENTLY BATCHED QUANTITY',
  },
  quantityAbove: {
    id: 'modules.Orders.quantityAbove',
    defaultMessage: 'Currently batched quantity is {diff} above the order quantity. Please revise.',
  },
  quantityBelow: {
    id: 'modules.Orders.quantityBelow',
    defaultMessage: 'Currently batched quantity is {diff} below the order quantity. Please revise.',
  },
  notShippedQuantity: {
    id: 'modules.Orders.notShippedQuantity',
    defaultMessage: 'REST NOT SHIPPED QUANTITY',
  },
  shipmentStatus: {
    id: 'modules.Orders.shipmentStatus',
    defaultMessage: 'SHIPMENT STATUS',
  },
  productName: {
    id: 'modules.Orders.productName',
    defaultMessage: 'Product Name',
  },
  productPrice: {
    id: 'modules.Orders.productPrice',
    defaultMessage: 'PRODUCT PRICE',
  },
  productUnit: {
    id: 'modules.Orders.productUnit',
    defaultMessage: 'UNIT TYPE',
  },
  supplier: {
    id: 'modules.Orders.supplier',
    defaultMessage: 'Supplier',
  },
  endProductName: {
    id: 'modules.Orders.endProductName',
    defaultMessage: 'End Product Name',
  },
  batchNo: {
    id: 'modules.Batches.no',
    defaultMessage: 'BATCH ID',
  },
  packageCapacity: {
    id: 'modules.Batches.packageCapacity',
    defaultMessage: 'PACKAGE CAPACITY',
  },
  expiredAt: {
    id: 'modules.Batches.expiredAt',
    defaultMessage: 'EXPIRY',
  },
  producedAt: {
    id: 'modules.Batches.producedAt',
    defaultMessage: 'PRODUCTION DATE',
  },
  deliveredAt: {
    id: 'modules.Batches.deliveredAt',
    defaultMessage: 'DELIVERY DATE',
  },
  totalAssignedQuantity: {
    id: 'modules.Orders.totalAssignedQuantity',
    defaultMessage: 'TOTAL ASSIGNED QUANTITY',
  },
  totalPrice: {
    id: 'modules.Orders.totalPrice',
    defaultMessage: 'TOTAL PRICE',
  },
  totalVolume: {
    id: 'modules.Orders.totalVolume',
    defaultMessage: 'TOTAL VOLUME',
  },
  totalOrderPrice: {
    id: 'modules.Orders.totalOrderPrice',
    defaultMessage: 'TOTAL ORDER PRICE',
  },
  totalOrderedQuantity: {
    id: 'modules.Orders.totalOrderedQuantity',
    defaultMessage: 'TOTAL ORDERED',
  },
  totalBatchedQuantity: {
    id: 'modules.Orders.totalBatchedQuantity',
    defaultMessage: 'TOTAL BATCHED',
  },
  totalShippedQuantity: {
    id: 'modules.Orders.totalShippedQuantity',
    defaultMessage: 'TOTAL SHIPPED',
  },
  totalUnshippedQuantity: {
    id: 'modules.Orders.totalUnshippedQuantity',
    defaultMessage: 'TOTAL UNSHIPPED',
  },
  inventory: {
    id: 'modules.Orders.inventory',
    defaultMessage: 'INVENTORY',
  },
  user: {
    id: 'modules.Orders.user',
    defaultMessage: 'STAFF',
  },
  itemCount: {
    id: 'modules.Orders.itemCount',
    defaultMessage: 'ITEM COUNT',
  },
  item: {
    id: 'modules.Orders.item',
    defaultMessage: 'ITEM',
  },
  tags: {
    id: 'modules.Orders.tags',
    defaultMessage: 'TAGS',
  },
  shipmentPending: {
    id: 'modules.Orders.shipment.pending',
    defaultMessage: 'Before Cargo Ready',
  },
  shipmentCargoReady: {
    id: 'modules.Orders.shipment.cargoReady',
    defaultMessage: 'Cargo Ready',
  },
  shipmentHasLeftLoadPort: {
    id: 'modules.Orders.shipment.hasLeftLoadPort',
    defaultMessage: 'Departed from Load Port',
  },
  shipmentHasArrivedTransitPort: {
    id: 'modules.Orders.shipment.hasArrivedTransitPort',
    defaultMessage: 'Arrived at Transit Port {index}',
  },
  shipmentHasLeftTransitPort: {
    id: 'modules.Orders.shipment.hasLeftTransitPort',
    defaultMessage: 'Departed from Transit Port {index}',
  },
  shipmentHasArrivedDischargePort: {
    id: 'modules.Orders.shipment.hasArrivedDischargePort',
    defaultMessage: 'Arrived at Discharge Port',
  },
  shipmentCustomCleared: {
    id: 'modules.Orders.shipment.customCleared',
    defaultMessage: 'Completed Custom Clearance',
  },
  shipmentArrivedWarehouse: {
    id: 'modules.Orders.shipment.arrivedWarehouse',
    defaultMessage: 'Arrived at Warehouse',
  },
  packageName: {
    id: 'modules.Batches.packageName',
    defaultMessage: 'PACKAGE NAME',
  },
  packageGrossWeight: {
    id: 'modules.Batches.packageGrossWeight',
    defaultMessage: 'PACKAGE GROSS WEIGHT',
  },
  packageVolume: {
    id: 'modules.Batches.packageVolume',
    defaultMessage: 'PACKAGE GROSS VOLUME',
  },
  packageMaxQuantity: {
    id: 'modules.Orders.packageMaxQuantity',
    defaultMessage: 'MAX QUANTITY / PACKAGE',
  },
  packageSize: {
    id: 'modules.Batches.packageSize',
    defaultMessage: 'PACKAGE SIZE (m)',
  },
  required: {
    id: 'modules.Orders.validation.required',
    defaultMessage: 'Required',
  },
  minZero: {
    id: 'modules.Orders.validation.minZero',
    defaultMessage: 'Min value is zero',
  },
  maxDecimal: {
    id: 'modules.Orders.validation.maxDecimal',
    defaultMessage: 'Max decimal is {count}',
  },
  duplicateProduct: {
    id: 'modules.Orders.validation.duplicateProduct',
    defaultMessage: 'Duplicate product',
  },
  chooseExporter: {
    id: 'modules.Orders.validation.chooseExporter',
    defaultMessage: 'Please choose an Exporter first',
  },
  fileTypeDocument: {
    id: 'modules.Orders.fileType.document',
    defaultMessage: 'Miscellaneous',
  },
  fileTypeOrderPO: {
    id: 'modules.Orders.fileType.orderPO',
    defaultMessage: 'Order PO',
  },
  fileTypeOrderPI: {
    id: 'modules.Orders.fileType.orderPI',
    defaultMessage: 'Order PI',
  },
  sectionDocuments: {
    id: 'modules.Orders.sectionDocuments',
    defaultMessage: 'DOCUMENTS',
  },
  sectionGeneral: {
    id: 'modules.Orders.sectionGeneral',
    defaultMessage: 'GENERAL',
  },
  sectionItems: {
    id: 'modules.Orders.sectionItems',
    defaultMessage: 'ITEMS',
  },
  sectionBatches: {
    id: 'modules.Orders.sectionBatches',
    defaultMessage: 'BATCHES',
  },
  sectionPackage: {
    id: 'modules.Orders.sectionPackage',
    defaultMessage: 'PACKAGING',
  },
  tasks: {
    id: 'modules.order.tasks',
    defaultMessage: 'TASKS',
  },
  logs: {
    id: 'modules.order.logs',
    defaultMessage: 'LOGS',
  },
  mask: {
    id: 'modules.order.mask',
    defaultMessage: 'Custom fields template',
  },
  sectionTimeline: {
    id: 'modules.Orders.sectionTimeline',
    defaultMessage: 'LOGS & MESSAGE BOARD',
  },
  sectionAssignments: {
    id: 'modules.Orders.sectionAssignments',
    defaultMessage: 'ASSIGNMENTS',
  },
  addItem: {
    id: 'modules.Orders.addItem',
    defaultMessage: 'ADD ITEM',
  },
  addBatch: {
    id: 'modules.Orders.addBatch',
    defaultMessage: 'ADD BATCH',
  },
  currencyNotMatch: {
    id: 'modules.Orders.currencyNotMatch',
    defaultMessage: 'Unit price is in {currency}. Please revise',
  },
  downloadCSV: {
    id: 'modules.Orders.downloadCSV',
    defaultMessage: 'ALL LIST',
  },
  downloadPO: {
    id: 'modules.Orders.downloadPO',
    defaultMessage: 'PO',
  },
  adjustmentType: {
    id: 'modules.Orders.adjustmentType',
    defaultMessage: 'CATEGORY',
  },
  sectionAdjustments: {
    id: 'modules.Orders.sectionAdjustments',
    defaultMessage: 'QUANTITY ADJUSTMENTS',
  },
  addAdjustment: {
    id: 'modules.Orders.addAdjustment',
    defaultMessage: 'ADD ADJUSTMENT',
  },
  updatedAtSort: {
    id: 'modules.Orders.list.sort.updatedAt',
    defaultMessage: 'Last Modified',
  },
  createdAtSort: {
    id: 'modules.Orders.list.sort.createdAt',
    defaultMessage: 'Date Created',
  },
  poSort: {
    id: 'modules.Orders.list.sort.po',
    defaultMessage: 'PO No.',
  },
  piSort: {
    id: 'modules.Orders.list.sort.pi',
    defaultMessage: 'PI No.',
  },
  issuedAtSort: {
    id: 'modules.Orders.list.sort.issuedAt',
    defaultMessage: 'PO Date',
  },
  exporterNameSort: {
    id: 'modules.Orders.list.sort.exporterName',
    defaultMessage: 'Exporter',
  },
  currencySort: {
    id: 'modules.Orders.list.sort.currency',
    defaultMessage: 'Currency',
  },
  incotermSort: {
    id: 'modules.Orders.list.sort.incoterm',
    defaultMessage: 'Incoterms',
  },
  deliveryPlaceSort: {
    id: 'modules.Orders.list.sort.deliveryPlace',
    defaultMessage: 'Place of Delivery',
  },
  nameSort: {
    id: 'modules.Orders.list.sort.name',
    defaultMessage: 'NAME',
  },
  serialSort: {
    id: 'modules.Orders.list.sort.serial',
    defaultMessage: 'SERIAL',
  },
  productSerial: {
    id: 'modules.Orders.productSerial',
    defaultMessage: 'Product Serial',
  },
  exporterSort: {
    id: 'modules.Orders.list.sort.exporter',
    defaultMessage: 'Exporter',
  },
  batch: {
    id: 'modules.Orders.form.batch',
    defaultMessage: 'BATCH',
  },
  noItems: {
    id: 'modules.Orders.form.noItems',
    defaultMessage: 'No Items found / Please choose Exporter first',
  },
  newItems: {
    id: 'modules.Orders.form.newItems',
    defaultMessage: 'NEW ITEMS',
  },
  inCharge: {
    id: 'modules.Orders.inCharge',
    defaultMessage: 'IN CHARGE',
  },
  autoFillBatch: {
    id: 'modules.Orders.autoFillBatch',
    defaultMessage: 'AUTOFILL BATCH',
  },
  detectPriceChanged: {
    id: 'modules.Orders.detectPriceChanged',
    defaultMessage: 'It is detected that some of your {items} have Unit Prices filled in.',
  },
  changePrice: {
    id: 'modules.Orders.changePrice',
    defaultMessage: 'Changing your Currency will change the Currencies of all your {items}.',
  },
  resetPrice: {
    id: 'modules.Orders.resetPrice',
    defaultMessage: 'Would you like to reset all Unit Prices to 0?',
  },
  totalItemQuantity: {
    id: 'modules.Orders.totalItemQuantity',
    defaultMessage: 'TOTAL ITEM QUANTITY',
  },
  completelyBatched: {
    id: 'modules.Orders.completelyBatched',
    defaultMessage: 'Fully Batched',
  },
  completelyShipped: {
    id: 'modules.Orders.completelyShipped',
    defaultMessage: 'Fully Shipped',
  },
  changeExporterWarning: {
    id: 'modules.Orders.changeExporterWarning',
    defaultMessage:
      'Changing the Exporter will remove all Items and Batches. It will also remove all assigned Staff of the current Exporter from all Tasks and In Charge. Are you sure you want to change the Exporter?',
  },
});
