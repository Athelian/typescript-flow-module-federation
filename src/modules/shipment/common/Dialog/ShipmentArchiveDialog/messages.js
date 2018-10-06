// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  confirmMsg: {
    id: 'modules.shipment.form.archiveDialog.confirmMsg',
    defaultMessage: 'Are you sure you want to archive this {shipment}?',
  },
  unshippedMsg: {
    id: 'modules.shipment.form.archiveDialog.unshippedMsg',
    defaultMessage: 'This will make {unshipped}/{total} {batches} archived as well.',
  },
  shippedMsg: {
    id: 'modules.shipment.form.archiveDialog.shippedMsg',
    defaultMessage:
      '{shipped}/{total} {batches} will stay active because they are in active {orders}.',
  },
  warnMsg: {
    id: 'modules.shipment.form.archiveDialog.warnMsg',
    defaultMessage: 'You need to archive those orders in order to archive these batches.',
  },
  shipment: {
    id: 'global.shipment',
    defaultMessage: 'shipment',
  },
  orders: {
    id: 'global.orders',
    defaultMessage: 'orders',
  },
  batches: {
    id: 'global.batches',
    defaultMessage: 'batches',
  },
});
