// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  save: {
    id: 'containers.Orders.save',
    defaultMessage: 'SAVE',
  },
  cancel: {
    id: 'containers.Orders.cancel',
    defaultMessage: 'CANCEL',
  },
  active: {
    id: 'containers.Orders.active',
    defaultMessage: 'ACTIVE',
  },
  completed: {
    id: 'containers.Orders.completed',
    defaultMessage: 'COMPLETED',
  },
  newOrder: {
    id: 'containers.Orders.newOrder',
    defaultMessage: 'NEW',
  },
  noOrders: {
    id: 'containers.Orders.noOrders',
    defaultMessage: 'No orders found.',
  },
  noBatches: {
    id: 'containers.Orders.noBatches',
    defaultMessage: 'No batches found.',
  },
  noShipment: {
    id: 'containers.Orders.noShipment',
    defaultMessage: 'No shipment.',
  },
  tooltipNo: {
    id: 'containers.Orders.tooltip.no',
    defaultMessage: '[Batch ID] {no}',
  },
  tooltipDelivery: {
    id: 'containers.Orders.tooltip.delivery',
    defaultMessage: '[Delivery Date] {delivery}',
  },
  tooltipPO: {
    id: 'containers.Orders.tooltip.PO',
    defaultMessage: '[PO] {PO}',
  },
  tooltipPODate: {
    id: 'containers.Orders.tooltip.PODate',
    defaultMessage: '[PO Date] {date}',
  },
  tooltipOrderedQuantity: {
    id: 'containers.Orders.tooltip.orderedQuantity',
    defaultMessage: '[Total Ordered] {totalQuantity}',
  },
  tooltipBatchedQuantity: {
    id: 'containers.Orders.tooltip.batchedQuantity',
    defaultMessage: '[Total Batched] {totalBatchedQuantity}',
  },
  tooltipShippedQuantity: {
    id: 'containers.Orders.tooltip.shippedQuantity',
    defaultMessage: '[Total Shipped] {totalShippedQuantity}',
  },
  tooltipUnshippedQuantity: {
    id: 'containers.Orders.tooltip.unshippedQuantity',
    defaultMessage: '[Total Unshipped] {totalUnshippedQuantity}',
  },
  tooltipOpenChart: {
    id: 'containers.Orders.tooltip.openChart',
    defaultMessage: 'Show Items',
  },
  tooltipExporter: {
    id: 'containers.Orders.tooltip.exporter',
    defaultMessage: '[Exporter] {exporter}',
  },
  tooltipSupplier: {
    id: 'containers.Orders.tooltip.supplier',
    defaultMessage: '[Supplier] {supplier}',
  },
  tooltipProduct: {
    id: 'containers.Orders.tooltip.product',
    defaultMessage: '[Product] {product}',
  },
  tooltipSerial: {
    id: 'containers.Orders.tooltip.serial',
    defaultMessage: '[Serial] {serial}',
  },
  tooltipQuantity: {
    id: 'containers.Orders.tooltip.quantity',
    defaultMessage: '[Quantity] {quantity}',
  },
  tooltipPrice: {
    id: 'containers.Orders.tooltip.price',
    defaultMessage: '[Price] {currencyAndPrice}',
  },
  tooltipDetails: {
    id: 'containers.Orders.tooltip.details',
    defaultMessage: 'View Details',
  },
  PO: {
    id: 'containers.Orders.poNo',
    defaultMessage: 'PO NO.',
  },
  date: {
    id: 'containers.Orders.issuedAt',
    defaultMessage: 'PO DATE',
  },
  PI: {
    id: 'containers.Orders.piNo',
    defaultMessage: 'PI NO.',
  },
  incoterm: {
    id: 'containers.Orders.incoterms',
    defaultMessage: 'INCOTERMS',
  },
  deliveryPlace: {
    id: 'containers.Orders.deliveryPlace',
    defaultMessage: 'PLACE OF DELIVERY',
  },
  currency: {
    id: 'containers.Orders.currency',
    defaultMessage: 'CURRENCY',
  },
  exporter: {
    id: 'containers.Orders.exporter',
    defaultMessage: 'EXPORTER',
  },
  forwarder: {
    id: 'containers.Orders.forwarder',
    defaultMessage: 'FORWARDER',
  },
  memo: {
    id: 'containers.Orders.memo',
    defaultMessage: 'MEMO',
  },
  batchMemo: {
    id: 'containers.Batches.memo',
    defaultMessage: 'MEMO',
  },
  createdAt: {
    id: 'containers.Orders.createdAt',
    defaultMessage: 'CREATED ON',
  },
  updatedAt: {
    id: 'containers.Orders.updatedAt',
    defaultMessage: 'LAST MODIFIED',
  },
  status: {
    id: 'containers.Orders.status',
    defaultMessage: 'STATUS',
  },
  productExporterSupplier: {
    id: 'containers.Orders.productExporterSupplier',
    defaultMessage: 'PRODUCT',
  },
  serial: {
    id: 'containers.Orders.serial',
    defaultMessage: 'SERIAL',
  },
  unit: {
    id: 'containers.Orders.unit',
    defaultMessage: 'UNIT TYPE',
  },
  price: {
    id: 'containers.Orders.price',
    defaultMessage: 'UNIT PRICE',
  },
  itemPrice: {
    id: 'containers.OrderItems.price',
    defaultMessage: 'ORDER ITEM UNIT PRICE',
  },
  originalPrice: {
    id: 'containers.Orders.originalPrice',
    defaultMessage: 'ORIGINAL UNIT PRICE',
  },
  expiry: {
    id: 'containers.Orders.expiry',
    defaultMessage: 'EXPIRY DATE',
  },
  quantity: {
    id: 'containers.Orders.quantity',
    defaultMessage: 'QUANTITY',
  },
  itemQuantity: {
    id: 'containers.OrderItems.quantity',
    defaultMessage: 'ORDER ITEM QUANTITY',
  },
  batchQuantity: {
    id: 'containers.Batches.quantity',
    defaultMessage: 'BATCH QUANTITY',
  },
  packageQuantity: {
    id: 'containers.Batches.packageQuantity',
    defaultMessage: 'PACKAGE QUANTITY',
  },
  shippedQuantity: {
    id: 'containers.Orders.shippedQuantity',
    defaultMessage: 'ALREADY CARGO READY QUANTITY',
  },
  batchedQuantity: {
    id: 'containers.Orders.batchedQuantity',
    defaultMessage: 'CURRENTLY BATCHED QUANTITY',
  },
  quantityAbove: {
    id: 'containers.Orders.quantityAbove',
    defaultMessage: 'Currently batched quantity is {diff} above the order quantity. Please revise.',
  },
  quantityBelow: {
    id: 'containers.Orders.quantityBelow',
    defaultMessage: 'Currently batched quantity is {diff} below the order quantity. Please revise.',
  },
  notShippedQuantity: {
    id: 'containers.Orders.notShippedQuantity',
    defaultMessage: 'REST NOT SHIPPED QUANTITY',
  },
  shipmentStatus: {
    id: 'containers.Orders.shipmentStatus',
    defaultMessage: 'SHIPMENT STATUS',
  },
  productName: {
    id: 'containers.Orders.productName',
    defaultMessage: 'PRODUCT NAME',
  },
  productPrice: {
    id: 'containers.Orders.productPrice',
    defaultMessage: 'PRODUCT PRICE',
  },
  productUnit: {
    id: 'containers.Orders.productUnit',
    defaultMessage: 'UNIT TYPE',
  },
  supplier: {
    id: 'containers.Orders.supplier',
    defaultMessage: 'SUPPLIER',
  },
  batchNo: {
    id: 'containers.Batches.no',
    defaultMessage: 'BATCH ID',
  },
  packageCapacity: {
    id: 'containers.Batches.packageCapacity',
    defaultMessage: 'PACKAGE CAPACITY',
  },
  expiredAt: {
    id: 'containers.Batches.expiredAt',
    defaultMessage: 'EXPIRY',
  },
  producedAt: {
    id: 'containers.Batches.producedAt',
    defaultMessage: 'PRODUCTION DATE',
  },
  deliveredAt: {
    id: 'containers.Batches.deliveredAt',
    defaultMessage: 'DELIVERY DATE',
  },
  totalAssignedQuantity: {
    id: 'containers.Orders.totalAssignedQuantity',
    defaultMessage: 'TOTAL ASSIGNED QUANTITY',
  },
  totalPrice: {
    id: 'containers.Orders.totalPrice',
    defaultMessage: 'TOTAL PRICE',
  },
  totalVolume: {
    id: 'containers.Orders.totalVolume',
    defaultMessage: 'TOTAL VOLUME',
  },
  totalOrderPrice: {
    id: 'containers.Orders.totalOrderPrice',
    defaultMessage: 'TOTAL ORDER PRICE',
  },
  totalOrderedQuantity: {
    id: 'containers.Orders.totalOrderedQuantity',
    defaultMessage: 'TOTAL ORDERED',
  },
  totalBatchedQuantity: {
    id: 'containers.Orders.totalBatchedQuantity',
    defaultMessage: 'TOTAL BATCHED',
  },
  totalShippedQuantity: {
    id: 'containers.Orders.totalShippedQuantity',
    defaultMessage: 'TOTAL SHIPPED',
  },
  totalUnshippedQuantity: {
    id: 'containers.Orders.totalUnshippedQuantity',
    defaultMessage: 'TOTAL UNSHIPPED',
  },
  inventory: {
    id: 'containers.Orders.inventory',
    defaultMessage: 'INVENTORY',
  },
  user: {
    id: 'containers.Orders.user',
    defaultMessage: 'STAFF',
  },
  itemCount: {
    id: 'containers.Orders.itemCount',
    defaultMessage: 'ITEM COUNT',
  },
  item: {
    id: 'containers.Orders.item',
    defaultMessage: 'ITEM',
  },
  tags: {
    id: 'containers.Orders.tags',
    defaultMessage: 'TAGS',
  },
  shipmentPending: {
    id: 'containers.Orders.shipment.pending',
    defaultMessage: 'Before Cargo Ready',
  },
  shipmentCargoReady: {
    id: 'containers.Orders.shipment.cargoReady',
    defaultMessage: 'Cargo Ready',
  },
  shipmentHasLeftLoadPort: {
    id: 'containers.Orders.shipment.hasLeftLoadPort',
    defaultMessage: 'Departed from Load Port',
  },
  shipmentHasArrivedTransitPort: {
    id: 'containers.Orders.shipment.hasArrivedTransitPort',
    defaultMessage: 'Arrived at Transit Port {index}',
  },
  shipmentHasLeftTransitPort: {
    id: 'containers.Orders.shipment.hasLeftTransitPort',
    defaultMessage: 'Departed from Transit Port {index}',
  },
  shipmentHasArrivedDischargePort: {
    id: 'containers.Orders.shipment.hasArrivedDischargePort',
    defaultMessage: 'Arrived at Discharge Port',
  },
  shipmentCustomCleared: {
    id: 'containers.Orders.shipment.customCleared',
    defaultMessage: 'Completed Custom Clearance',
  },
  shipmentArrivedWarehouse: {
    id: 'containers.Orders.shipment.arrivedWarehouse',
    defaultMessage: 'Arrived at Warehouse',
  },
  packageName: {
    id: 'containers.Batches.packageName',
    defaultMessage: 'PACKAGE NAME',
  },
  packageGrossWeight: {
    id: 'containers.Orders.packageGrossWeight',
    defaultMessage: 'PACKAGE GROSS WEIGHT',
  },
  packageVolume: {
    id: 'containers.Orders.packageVolume',
    defaultMessage: 'PACKAGE GROSS VOLUME',
  },
  packageMaxQuantity: {
    id: 'containers.Orders.packageMaxQuantity',
    defaultMessage: 'MAX QUANTITY / PACKAGE',
  },
  packageSize: {
    id: 'containers.Batches.packageSize',
    defaultMessage: 'PACKAGE SIZE (m)',
  },
  required: {
    id: 'containers.Orders.validation.required',
    defaultMessage: 'Required',
  },
  minZero: {
    id: 'containers.Orders.validation.minZero',
    defaultMessage: 'Min value is zero',
  },
  maxDecimal: {
    id: 'containers.Orders.validation.maxDecimal',
    defaultMessage: 'Max decimal is {count}',
  },
  duplicateProduct: {
    id: 'containers.Orders.validation.duplicateProduct',
    defaultMessage: 'Duplicate product',
  },
  chooseExporter: {
    id: 'containers.Orders.validation.chooseExporter',
    defaultMessage: 'Please choose an Exporter first',
  },
  fileTypeDocument: {
    id: 'containers.Orders.fileType.document',
    defaultMessage: 'Document',
  },
  fileTypeOrderPO: {
    id: 'containers.Orders.fileType.orderPO',
    defaultMessage: 'Order PO',
  },
  fileTypeOrderPI: {
    id: 'containers.Orders.fileType.orderPI',
    defaultMessage: 'Order PI',
  },
  sectionDocuments: {
    id: 'containers.Orders.sectionDocuments',
    defaultMessage: 'DOCUMENTS',
  },
  sectionGeneral: {
    id: 'containers.Orders.sectionGeneral',
    defaultMessage: 'GENERAL',
  },
  sectionItems: {
    id: 'containers.Orders.sectionItems',
    defaultMessage: 'ITEMS',
  },
  sectionBatches: {
    id: 'containers.Orders.sectionBatches',
    defaultMessage: 'BATCHES',
  },
  sectionPackage: {
    id: 'containers.Orders.sectionPackage',
    defaultMessage: 'PACKAGING',
  },
  sectionTimeline: {
    id: 'containers.Orders.sectionTimeline',
    defaultMessage: 'LOGS & MESSAGE BOARD',
  },
  sectionAssignments: {
    id: 'containers.Orders.sectionAssignments',
    defaultMessage: 'ASSIGNMENTS',
  },
  addItem: {
    id: 'containers.Orders.addItem',
    defaultMessage: 'ADD ITEM',
  },
  addBatch: {
    id: 'containers.Orders.addBatch',
    defaultMessage: 'ADD BATCH',
  },
  currencyNotMatch: {
    id: 'containers.Orders.currencyNotMatch',
    defaultMessage: 'Unit price is in {currency}. Please revise',
  },
  downloadCSV: {
    id: 'containers.Orders.downloadCSV',
    defaultMessage: 'ALL LIST',
  },
  downloadPO: {
    id: 'containers.Orders.downloadPO',
    defaultMessage: 'PO',
  },
  adjustmentType: {
    id: 'containers.Orders.adjustmentType',
    defaultMessage: 'CATEGORY',
  },
  sectionAdjustments: {
    id: 'containers.Orders.sectionAdjustments',
    defaultMessage: 'QUANTITY ADJUSTMENTS',
  },
  addAdjustment: {
    id: 'containers.Orders.addAdjustment',
    defaultMessage: 'ADD ADJUSTMENT',
  },
  poSort: {
    id: 'modules.order.list.sort.po',
    defaultMessage: 'PO No',
  },
  nameSort: {
    id: 'modules.order.list.sort.name',
    defaultMessage: 'NAME',
  },
  serialSort: {
    id: 'modules.order.list.sort.serial',
    defaultMessage: 'SERIAL',
  },
  exporterSort: {
    id: 'modules.order.list.sort.exporter',
    defaultMessage: 'Exporter',
  },
  createdAtSort: {
    id: 'modules.order.list.sort.createdAt',
    defaultMessage: 'Created At',
  },
  updatedAtSort: {
    id: 'modules.order.list.sort.updatedAt',
    defaultMessage: 'Updated At',
  },
  batch: {
    id: 'modules.order.form.batch',
    defaultMessage: 'BATCH',
  },
  noItems: {
    id: 'modules.order.form.noItems',
    defaultMessage: 'No Items found / Please choose Exporter first',
  },
  newItems: {
    id: 'modules.order.form.newItems',
    defaultMessage: 'NEW ITEMS',
  },
});
