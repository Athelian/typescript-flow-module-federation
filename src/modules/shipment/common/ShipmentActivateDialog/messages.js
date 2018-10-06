// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  confirmMsg: {
    id: 'modules.shipment.form.activateDialog.confirmMsg',
    defaultMessage: 'Are you sure you want to activate this {shipment}?',
  },
  unshippedMsg: {
    id: 'modules.shipment.form.activateDialog.unshippedMsg',
    defaultMessage: 'This will activate {unshipped}/{total} {batches} as well.',
  },
  shippedMsg: {
    id: 'modules.shipment.form.activateDialog.shippedMsg',
    defaultMessage:
      '{shipped}/{total} {batches} are already active because they are in active {orders}.',
  },
  order: {
    id: 'global.order',
    defaultMessage: 'order',
  },
  orders: {
    id: 'global.orders',
    defaultMessage: 'orders',
  },
  batches: {
    id: 'global.batches',
    defaultMessage: 'batches',
  },
  shipment: {
    id: 'global.shipments',
    defaultMessage: 'shipment',
  },
  shipments: {
    id: 'global.shipments',
    defaultMessage: 'shipments',
  },
});
