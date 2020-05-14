// @flow
import productMessages from 'modules/product/messages';
import orderMessages from 'modules/order/messages';
import orderItemMessages from 'modules/orderItem/messages';
import batchMessages from 'modules/batch/messages';
import { shipmentSortMessages as shipmentMessages } from 'modules/shipment/messages';
import containerMessages from 'modules/container/messages';
import warehouseMessages from 'modules/warehouse/messages';
import partnerMessages from 'modules/partner/messages';
import userMessages from 'modules/staff/messages';
import fileMessages from 'modules/document/messages';
import projectMessages from 'modules/project/messages';
import taskMessages from 'modules/task/messages';
import tagMessages from 'modules/tags/messages';
import tableTemplateMessages from 'modules/tableTemplate/messages';
import type { SortConfig } from './index';

export const ProductSortConfig: Array<SortConfig> = [
  { message: productMessages.updatedAt, field: 'updatedAt' },
  { message: productMessages.createdAt, field: 'createdAt' },
  { message: productMessages.name, field: 'name' },
  { message: productMessages.serial, field: 'serial' },
];

export const ProductProviderSortConfig: Array<SortConfig> = [
  { message: orderMessages.updatedAt, field: 'updatedAt' },
  { message: orderMessages.createdAt, field: 'createdAt' },
  { message: orderMessages.endProductName, field: 'name' },
  { message: orderMessages.productName, field: 'productName' },
  { message: orderMessages.productSerial, field: 'productSerial' },
  { message: orderMessages.priceCurrency, field: 'unitPriceCurrency' },
  { message: orderMessages.exporterName, field: 'exporterName' },
  { message: orderMessages.supplier, field: 'supplierName' },
];

export const OrderSortConfig: Array<SortConfig> = [
  { message: orderMessages.updatedAt, field: 'updatedAt' },
  { message: orderMessages.createdAt, field: 'createdAt' },
  { message: orderMessages.poSort, field: 'poNo' },
  { message: orderMessages.piSort, field: 'piNo' },
  { message: orderMessages.date, field: 'issuedAt' },
  { message: orderMessages.exporterName, field: 'exporterName' },
  { message: orderMessages.currency, field: 'currency' },
  { message: orderMessages.incoterm, field: 'incoterm' },
  { message: orderMessages.deliveryPlace, field: 'deliveryPlace' },
];

export const OrderItemSortConfig: Array<SortConfig> = [
  { message: orderItemMessages.updatedAt, field: 'updatedAt' },
  { message: orderItemMessages.createdAt, field: 'createdAt' },
  { message: orderItemMessages.no, field: 'no' },
  { message: orderItemMessages.currency, field: 'currency' },
  { message: orderItemMessages.productName, field: 'productName' },
  { message: orderItemMessages.productSerial, field: 'productSerial' },
  { message: orderItemMessages.productProviderName, field: 'productProviderName' },
  { message: orderItemMessages.supplierName, field: 'supplierName' },
];

export const BatchSortConfig: Array<SortConfig> = [
  { message: batchMessages.updatedAt, field: 'updatedAt' },
  { message: batchMessages.createdAt, field: 'createdAt' },
  { message: batchMessages.batchNo, field: 'no' },
  { message: batchMessages.poNo, field: 'poNo' },
  { message: batchMessages.exporter, field: 'orderExporter' },
  { message: batchMessages.productName, field: 'productName' },
  { message: batchMessages.productSerial, field: 'productSerial' },
  { message: batchMessages.producedAt, field: 'producedAt' },
  { message: batchMessages.deliveredAt, field: 'deliveredAt' },
  { message: batchMessages.expiredAt, field: 'expiredAt' },
  { message: batchMessages.desiredAt, field: 'desiredAt' },
  { message: batchMessages.containerFreeTimeDueDate, field: 'containerFreeTimeDueDate' },
  {
    message: batchMessages.containerWarehouseAgreedArrivalDate,
    field: 'containerWarehouseAgreedArrivalDate',
  },
  { message: batchMessages.shipmentNo, field: 'shipmentNo' },
  { message: batchMessages.shipmentLoadPort, field: 'shipmentLoadPort' },
  { message: batchMessages.shipmentLoadPortDeparture, field: 'shipmentLoadPortDeparture' },
  { message: batchMessages.shipmentDischargePort, field: 'shipmentDischargePort' },
  { message: batchMessages.shipmentDischargePortArrival, field: 'shipmentDischargePortArrival' },
];

export const ShipmentSortConfig: Array<SortConfig> = [
  { message: shipmentMessages.updatedAt, field: 'updatedAt' },
  { message: shipmentMessages.createdAt, field: 'createdAt' },
  { message: shipmentMessages.shipmentId, field: 'no' },
  { message: shipmentMessages.blNo, field: 'blNo' },
  { message: shipmentMessages.vesselName, field: 'vesselName' },
  { message: shipmentMessages.cargoReady, field: 'cargoReady' },
  { message: shipmentMessages.loadPort, field: 'loadPort' },
  { message: shipmentMessages.loadPortDeparture, field: 'loadPortDeparture' },
  { message: shipmentMessages.firstTransitPortArrival, field: 'firstTransitPortArrival' },
  { message: shipmentMessages.firstTransitPortDeparture, field: 'firstTransitPortDeparture' },
  { message: shipmentMessages.secondTransitPortArrival, field: 'secondTransitPortArrival' },
  { message: shipmentMessages.secondTransitPortDeparture, field: 'secondTransitPortDeparture' },
  { message: shipmentMessages.dischargePort, field: 'dischargePort' },
  { message: shipmentMessages.dischargePortArrival, field: 'dischargePortArrival' },
  { message: shipmentMessages.customClearance, field: 'customClearance' },
  { message: shipmentMessages.warehouseArrival, field: 'warehouseArrival' },
  { message: shipmentMessages.deliveryReady, field: 'deliveryReady' },
];

export const ContainerSortConfig: Array<SortConfig> = [
  { message: containerMessages.updatedAt, field: 'updatedAt' },
  { message: containerMessages.createdAt, field: 'createdAt' },
  { message: containerMessages.warehouseName, field: 'warehouseName' },
  { message: containerMessages.warehouseArrivalActualDate, field: 'warehouseArrivalActualDate' },
  { message: containerMessages.warehouseArrivalAgreedDate, field: 'warehouseArrivalAgreedDate' },
  { message: containerMessages.dueDate, field: 'freeTimeDueDate' },
];

export const WarehouseSortConfig: Array<SortConfig> = [
  { message: warehouseMessages.updatedAt, field: 'updatedAt' },
  { message: warehouseMessages.createdAt, field: 'createdAt' },
];

export const PartnerSortConfig: Array<SortConfig> = [
  { message: partnerMessages.updatedAt, field: 'updatedAt' },
  { message: partnerMessages.createdAt, field: 'createdAt' },
  { message: partnerMessages.name, field: 'name' },
  { message: partnerMessages.code, field: 'code' },
];

export const UserSortConfig: Array<SortConfig> = [
  { message: userMessages.updatedAt, field: 'updatedAt' },
  { message: userMessages.createdAt, field: 'createdAt' },
  { message: userMessages.firstName, field: 'firstName' },
  { message: userMessages.lastName, field: 'lastName' },
  { message: userMessages.fullName, field: 'fullName' },
];

export const FileSortConfig: Array<SortConfig> = [
  { message: fileMessages.updatedAt, field: 'updatedAt' },
  { message: fileMessages.createdAt, field: 'createdAt' },
  { message: fileMessages.name, field: 'name' },
  { message: fileMessages.type, field: 'type' },
  { message: fileMessages.status, field: 'status' },
  { message: fileMessages.size, field: 'size' },
];

export const ProjectSortConfig: Array<SortConfig> = [
  { message: projectMessages.updatedAt, field: 'updatedAt' },
  { message: projectMessages.createdAt, field: 'createdAt' },
  { message: projectMessages.name, field: 'name' },
  { message: projectMessages.dueDate, field: 'dueDate' },
];

export const TaskSortConfig: Array<SortConfig> = [
  { message: taskMessages.updatedAt, field: 'updatedAt' },
  { message: taskMessages.createdAt, field: 'createdAt' },
  { message: taskMessages.name, field: 'name' },
  { message: taskMessages.startDate, field: 'startDate' },
  { message: taskMessages.dueDate, field: 'dueDate' },
  { message: taskMessages.entity, field: 'entity' },
];

export const TaskTemplateSortConfig: Array<SortConfig> = [
  { message: taskMessages.updatedAt, field: 'updatedAt' },
  { message: taskMessages.createdAt, field: 'createdAt' },
  { message: taskMessages.name, field: 'name' },
];

export const TagSortConfig: Array<SortConfig> = [
  { message: tagMessages.updatedAt, field: 'updatedAt' },
  { message: tagMessages.createdAt, field: 'createdAt' },
  { message: tagMessages.name, field: 'name' },
];

export const MaskEditSortConfig: Array<SortConfig> = [
  { message: tableTemplateMessages.updatedAt, field: 'updatedAt' },
  { message: tableTemplateMessages.createdAt, field: 'createdAt' },
  { message: tableTemplateMessages.name, field: 'name' },
];
