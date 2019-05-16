// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  confirmMsg: {
    id: 'modules.Orders.form.archiveDialog.confirmMsg',
    defaultMessage: 'Are you sure you want to archive this {order}?',
  },
  makeItemsArchived: {
    id: 'modules.Orders.archiveDialog.makeItemsArchiveMsg',
    defaultMessage: 'This will make all {orderItemCount} {items} archived as well.',
  },
  unshippedMsg: {
    id: 'modules.Orders.form.archiveDialog.unshippedMsg',
    defaultMessage: 'This will make {unshipped}/{total} {batches} archived as well.',
  },
  shippedMsg: {
    id: 'modules.Orders.form.archiveDialog.shippedMsg',
    defaultMessage:
      '{shipped}/{total} {batches} will stay active because they are in active {shipments}.',
  },
  warnMsg: {
    id: 'modules.Orders.form.archiveDialog.warnMsg',
    defaultMessage: 'You need to archive those shipments in order to archive these batches.',
  },
  order: {
    id: 'global.order',
    defaultMessage: 'order',
  },
  items: {
    id: 'modules.Orders.form.dialog.items',
    defaultMessage: 'items',
  },
  batches: {
    id: 'global.batches',
    defaultMessage: 'batches',
  },
  shipments: {
    id: 'global.shipments',
    defaultMessage: 'shipments',
  },
});
