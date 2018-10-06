// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  confirmMsg: {
    id: 'modules.order.form.activateDialog.confirmMsg',
    defaultMessage: 'Are you sure you want to activate this {order}?',
  },
  unshippedMsg: {
    id: 'modules.order.form.activateDialog.unshippedMsg',
    defaultMessage: 'This will activate {unshipped}/{total} {batches} as well.',
  },
  shippedMsg: {
    id: 'modules.order.form.activateDialog.shippedMsg',
    defaultMessage:
      '{shipped}/{total} {batches} are already active because they are in active {shipments}.',
  },
  order: {
    id: 'global.order',
    defaultMessage: 'order',
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
