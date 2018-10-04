// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  confirmMsg: {
    id: 'modules.order.form.archiveDialog.confirmMsg',
    defaultMessage: 'Are you sure you want to archive this {order}?',
  },
  unshippedMsg: {
    id: 'modules.order.form.archiveDialog.unshippedMsg',
    defaultMessage: 'This will make{unshipped}/{total} {batches} archived as well.',
  },
  shippedMsg: {
    id: 'modules.order.form.archiveDialog.shippedMsg',
    defaultMessage:
      '{shipped}/{total} {batches} will stay active because they are in active {shipments}.',
  },
  warnMsg: {
    id: 'modules.order.form.archiveDialog.warnMsg',
    defaultMessage: 'You need to archive those shipments in order to archive these batches.',
  },
  order: {
    id: 'modules.order.form.dialog.order',
    defaultMessage: 'order',
  },
  batches: {
    id: 'modules.order.form.dialog.batches',
    defaultMessage: 'batches',
  },
  shipments: {
    id: 'modules.order.form.dialog.shipments',
    defaultMessage: 'shipments',
  },
});
