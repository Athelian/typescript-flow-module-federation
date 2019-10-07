// @flow
import orderMessages from 'modules/order/messages';
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
