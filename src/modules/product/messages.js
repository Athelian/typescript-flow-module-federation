// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  name: {
    id: 'containers.Products.name',
    defaultMessage: 'NAME',
  },
  serial: {
    id: 'containers.Products.serial',
    defaultMessage: 'SERIAL',
  },
  JANCode: {
    id: 'containers.Products.JANCode',
    defaultMessage: 'JAN CODE',
  },
  HSCode: {
    id: 'containers.Products.HSCode',
    defaultMessage: 'HS CODE',
  },
  material: {
    id: 'containers.Products.material',
    defaultMessage: 'MATERIAL',
  },
  tags: {
    id: 'containers.Products.tags',
    defaultMessage: 'TAGS',
  },
  quantity: {
    id: 'containers.Products.quantity',
    defaultMessage: 'UNIT QUANTITY',
  },
  unit: {
    id: 'containers.Products.unit',
    defaultMessage: 'UNIT TYPE',
  },
  size: {
    id: 'containers.Products.size',
    defaultMessage: 'UNIT SIZE (m)',
  },
  volume: {
    id: 'containers.Products.volume',
    defaultMessage: 'NET VOLUME / UNIT',
  },
  weight: {
    id: 'containers.Products.weight',
    defaultMessage: 'NET WEIGHT / UNIT',
  },
  image: {
    id: 'containers.Products.image',
    defaultMessage: 'IMAGE',
  },
  createdAt: {
    id: 'containers.Products.createdAt',
    defaultMessage: 'CREATED ON',
  },
  updatedAt: {
    id: 'containers.Products.updatedAt',
    defaultMessage: 'LAST MODIFIED',
  },
  status: {
    id: 'containers.Products.status',
    defaultMessage: 'STATUS',
  },
  metadataKey: {
    id: 'containers.Products.metadataKey',
    defaultMessage: 'KEY',
  },
  metadataValue: {
    id: 'containers.Products.metadataValue',
    defaultMessage: 'VALUE',
  },
  exporter: {
    id: 'containers.Products.exporter',
    defaultMessage: 'EXPORTER',
  },
  supplier: {
    id: 'containers.Products.supplier',
    defaultMessage: 'SUPPLIER',
  },
  origin: {
    id: 'containers.Products.origin',
    defaultMessage: 'COUNTRY OF ORIGIN',
  },
  price: {
    id: 'containers.Products.price',
    defaultMessage: 'UNIT PRICE',
  },
  currency: {
    id: 'containers.Products.currency',
    defaultMessage: 'CURRENCY',
  },
  productionLeadTime: {
    id: 'containers.Products.productionLeadTime',
    defaultMessage: 'PRODUCTION LEAD TIME',
  },
  days: {
    id: 'containers.Products.days',
    defaultMessage: 'Days',
  },
  packageName: {
    id: 'containers.Products.packageName',
    defaultMessage: 'PACKAGE NAME',
  },
  packageGrossWeight: {
    id: 'containers.Products.packageGrossWeight',
    defaultMessage: 'PACKAGE GROSS WEIGHT',
  },
  packageVolume: {
    id: 'containers.Products.packageVolume',
    defaultMessage: 'PACKAGE GROSS VOLUME',
  },
  packageMaxQuantity: {
    id: 'containers.Products.packageMaxQuantity',
    defaultMessage: 'MAX QUANTITY / PACKAGE',
  },
  packageSize: {
    id: 'containers.Products.packageSize',
    defaultMessage: 'PACKAGE SIZE (m)',
  },
  inspectionFee: {
    id: 'containers.Products.inspectionFee',
    defaultMessage: 'INSPECTION FEE',
  },
  memo: {
    id: 'containers.Products.memo',
    defaultMessage: 'MEMO',
  },
  active: {
    id: 'containers.Products.active',
    defaultMessage: 'ACTIVE',
  },
  inactive: {
    id: 'containers.Products.inactive',
    defaultMessage: 'INACTIVE',
  },
  required: {
    id: 'containers.Products.validation.required',
    defaultMessage: 'Required',
  },
  duplicate: {
    id: 'containers.Products.validation.duplicate',
    defaultMessage: 'Duplicate exporter (and supplier) combination',
  },
  duplicateKey: {
    id: 'containers.Products.validation.duplicateKey',
    defaultMessage: 'Duplicate entry key',
  },
  invalidLength: {
    id: 'containers.Products.validation.length',
    defaultMessage: 'Must be exactly {length} characters long',
  },
  serialNotAvailable: {
    id: 'containers.Products.validation.serialNotAvailable',
    defaultMessage: 'Product serial is not available',
  },
  newProduct: {
    id: 'containers.Products.newProduct',
    defaultMessage: 'NEW',
  },
  infoTab: {
    id: 'containers.Products.infoTab',
    defaultMessage: 'INFO',
  },
  ordersTab: {
    id: 'containers.Products.ordersTab',
    defaultMessage: 'ORDERS',
  },
  batchItemsTab: {
    id: 'containers.Products.batchItemsTab',
    defaultMessage: 'BATCHES',
  },
  batchGroupsTab: {
    id: 'containers.Products.batchGroupsTab',
    defaultMessage: 'BATCH GROUPS',
  },
  shipmentsTab: {
    id: 'containers.Products.shipmentsTab',
    defaultMessage: 'SHIPMENTS',
  },
  noOrders: {
    id: 'containers.Products.noOrders',
    defaultMessage: 'No orders found for this product.',
  },
  noBatches: {
    id: 'containers.Products.noBatches',
    defaultMessage: 'No batches found for this product.',
  },
  noShipments: {
    id: 'containers.Products.noShipments',
    defaultMessage: 'No shipments found for this product.',
  },
  tooltipName: {
    id: 'containers.Products.tooltip.name',
    defaultMessage: '[Name] {name}',
  },
  tooltipSerial: {
    id: 'containers.Products.tooltip.serial',
    defaultMessage: '[Serial] {serial}',
  },
  tooltipExporter: {
    id: 'containers.Products.tooltip.exporter',
    defaultMessage: '[Exporter] {exporter}',
  },
  tooltipSupplier: {
    id: 'containers.Products.tooltip.supplier',
    defaultMessage: '[Supplier] {supplier}',
  },
  tooltipDetails: {
    id: 'containers.Products.tooltip.details',
    defaultMessage: 'View Details',
  },
  noProducts: {
    id: 'containers.Products.noProducts',
    defaultMessage: 'No products found.',
  },
  uploadImage: {
    id: 'containers.Products.uploadImage',
    defaultMessage: 'UPLOAD IMAGE',
  },
  uploadNewImage: {
    id: 'containers.Products.uploadNewImage',
    defaultMessage: 'UPLOAD NEW IMAGE',
  },
  specSheet: {
    id: 'containers.Products.specSheet',
    defaultMessage: 'Specification Sheet',
  },
  analysisCert: {
    id: 'containers.Products.analysisCert',
    defaultMessage: 'Certification of Analysis',
  },
  originCert: {
    id: 'containers.Products.originCert',
    defaultMessage: 'Certification of Origin',
  },
  other: {
    id: 'containers.Products.other',
    defaultMessage: 'Other',
  },
  addPES: {
    id: 'containers.Products.addPES',
    defaultMessage: 'EXPORTER & SUPPLIER',
  },
  addEntry: {
    id: 'containers.Products.addEntry',
    defaultMessage: 'ADD ENTRY',
  },
  sectionSpec: {
    id: 'containers.Products.sectionSpec',
    defaultMessage: 'SPECIFICATIONS',
  },
  sectionPES: {
    id: 'containers.Products.sectionPES',
    defaultMessage: 'EXPORTER & SUPPLIERS',
  },
  sectionPackage: {
    id: 'containers.Products.sectionPackage',
    defaultMessage: 'PACKAGING',
  },
  sectionDocuments: {
    id: 'containers.Products.sectionDocuments',
    defaultMessage: 'DOCUMENTS',
  },
  sectionMetadata: {
    id: 'containers.Products.sectionMetadata',
    defaultMessage: 'METADATA',
  },
  infoName: {
    id: 'containers.Products.infoName',
    defaultMessage: 'Product name is required',
  },
  infoSerial: {
    id: 'containers.Products.infoSerial',
    defaultMessage: 'Product serial is required',
  },
  infoJANCode: {
    id: 'containers.Products.infoJANCode',
    defaultMessage: 'JAN code is 13 characters long',
  },
  infoHSCode: {
    id: 'containers.Products.infoHSCode',
    defaultMessage: 'HS code is 10 characters long',
  },
  downloadCSV: {
    id: 'containers.Products.downloadCSV',
    defaultMessage: 'DOWNLOAD CSV',
  },
});
