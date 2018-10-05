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
      '{shipped}/{total} {batches} are already active because they are in active {shipments}.',
  },
  shipment: {
    id: 'modules.shipment.form.dialog.shipment',
    defaultMessage: 'shipment',
  },
  batches: {
    id: 'modules.shipment.form.dialog.batches',
    defaultMessage: 'batches',
  },
  shipments: {
    id: 'modules.shipment.form.dialog.shipments',
    defaultMessage: 'shipments',
  },
});
