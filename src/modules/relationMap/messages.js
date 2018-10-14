// @flow
import { defineMessages } from 'react-intl';

export const ORDER_HEADER = 'ORDER_HEADER';
export const ORDER = 'ORDER';
export const ORDER_ITEM = 'ORDER_ITEM';
export const ORDER_ITEM_ALL = 'ORDER_ITEM_ALL';
export const BATCH = 'BATCH';
export const BATCH_ALL = 'BATCH_ALL';
export const SHIPMENT = 'SHIPMENT';
export const SHIPMENT_ALL = 'SHIPMENT_ALL';

export default defineMessages({
  ordersTab: {
    id: 'global.orders',
    defaultMessage: 'ORDERS',
  },
  shipmentsTab: {
    id: 'global.shipments',
    defaultMessage: 'SHIPMENTS',
  },
  productsTab: {
    id: 'global.products',
    defaultMessage: 'PRODUCTS',
  },
  ordersLabel: {
    id: 'global.orders',
    defaultMessage: 'ORDERS',
  },
  shipmentsLabel: {
    id: 'global.shipments',
    defaultMessage: 'SHIPMENTS',
  },
  batchesLabel: {
    id: 'global.batches',
    defaultMessage: 'BATCHES',
  },
  itemsLabel: {
    id: 'global.items',
    defaultMessage: 'ITEMS',
  },
  poSort: {
    id: 'modules.relationMap.sort.po',
    defaultMessage: 'PO No',
  },
  updatedAtSort: {
    id: 'modules.relationMap.sort.updatedAt',
    defaultMessage: 'Updated At',
  },
  createdAtSort: {
    id: 'modules.relationMap.sort.createdAt',
    defaultMessage: 'Created At',
  },
  nameSort: {
    id: 'modules.relationMap.sort.name',
    defaultMessage: 'NAME',
  },
  serialSort: {
    id: 'modules.relationMap.sort.serial',
    defaultMessage: 'SERIAL',
  },
  all: {
    id: 'modules.relationMap.label.all',
    defaultMessage: 'ALL',
  },
  total: {
    id: 'modules.relationMap.label.total',
    defaultMessage: 'Total {number} {name}',
  },
});
