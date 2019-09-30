// @flow
import orderMessages from 'modules/order/messages';
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
