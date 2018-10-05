// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  confirmMsg: {
    id: 'modules.shipment.form.archiveDialog.confirmMsg',
    defaultMessage: 'Are you sure you want to archive this {shipment}?',
  },
  unshippedMsg: {
    id: 'modules.shipment.form.archiveDialog.unshippedMsg',
    defaultMessage: 'This will make{unshipped}/{total} {batches} archived as well.',
  },
  shippedMsg: {
    id: 'modules.shipment.form.archiveDialog.shippedMsg',
    defaultMessage:
      '{shipped}/{total} {batches} will stay active because they are in active {shipments}.',
  },
  warnMsg: {
    id: 'modules.shipment.form.archiveDialog.warnMsg',
    defaultMessage: 'You need to archive those shipments in shipment to archive these batches.',
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
