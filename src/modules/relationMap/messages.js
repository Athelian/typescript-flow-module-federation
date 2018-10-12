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
    id: 'containers.RelationMap.ordersTab',
    defaultMessage: 'ORDERS',
  },
  shipmentsTab: {
    id: 'containers.RelationMap.shipmentsTab',
    defaultMessage: 'SHIPMENTS',
  },
  productsTab: {
    id: 'containers.RelationMap.productsTab',
    defaultMessage: 'PRODUCTS',
  },
});
