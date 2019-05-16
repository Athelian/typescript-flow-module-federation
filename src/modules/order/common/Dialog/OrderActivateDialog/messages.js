// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  confirmMsg: {
    id: 'modules.Orders.form.activateDialog.confirmMsg',
    defaultMessage: 'Are you sure you want to activate this {order}?',
  },
  makeItemsActivate: {
    id: 'modules.Orders.archiveDialog.makeItemsArchiveMsg',
    defaultMessage: 'This will activate all {orderItemCount} {items} as well.',
  },
  unshippedMsg: {
    id: 'modules.Orders.form.activateDialog.unshippedMsg',
    defaultMessage: 'This will activate {unshipped}/{total} {batches} as well.',
  },
  shippedMsg: {
    id: 'modules.Orders.form.activateDialog.shippedMsg',
    defaultMessage:
      '{shipped}/{total} {batches} are already active because they are in active {shipments}.',
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
