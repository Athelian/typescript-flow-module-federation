// @flow
import orderMessages from 'modules/order/messages';
import batchMessages from 'modules/batch/messages';
import { shipmentSortMessages as shipmentMessages } from 'modules/shipment/messages';
import containerMessages from 'modules/container/messages';
import warehouseMessages from 'modules/warehouse/messages';
import partnerMessages from 'modules/partner/messages';
import type { SortConfig } from './index';

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

export const BatchSortConfig: Array<SortConfig> = [
  { message: batchMessages.updatedAt, field: 'updatedAt' },
  { message: batchMessages.createdAt, field: 'createdAt' },
  { message: batchMessages.batchNo, field: 'no' },
  { message: batchMessages.poNo, field: 'poNo' },
  { message: batchMessages.productName, field: 'productName' },
  { message: batchMessages.productSerial, field: 'productSerial' },
  { message: batchMessages.producedAt, field: 'producedAt' },
  { message: batchMessages.deliveredAt, field: 'deliveredAt' },
  { message: batchMessages.expiredAt, field: 'expiredAt' },
];

export const ShipmentSortConfig: Array<SortConfig> = [
  { message: shipmentMessages.updatedAt, field: 'updatedAt' },
  { message: shipmentMessages.createdAt, field: 'createdAt' },
  { message: shipmentMessages.shipmentId, field: 'no' },
  { message: shipmentMessages.blNo, field: 'blNo' },
  { message: shipmentMessages.vesselName, field: 'vesselName' },
  { message: shipmentMessages.cargoReady, field: 'cargoReady' },
  { message: shipmentMessages.loadPortDeparture, field: 'loadPortDeparture' },
  { message: shipmentMessages.firstTransitPortArrival, field: 'firstTransitPortArrival' },
  { message: shipmentMessages.firstTransitPortDeparture, field: 'firstTransitPortDeparture' },
  { message: shipmentMessages.secondTransitPortArrival, field: 'secondTransitPortArrival' },
  { message: shipmentMessages.secondTransitPortDeparture, field: 'secondTransitPortDeparture' },
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
