// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  confirmMsg: {
    id: 'modules.Shipments.form.activateDialog.confirmMsg',
    defaultMessage: 'Are you sure you want to activate this {shipment}?',
  },
  batchesOfArchivedOrderMsg: {
    id: 'modules.Shipments.form.activateDialog.batchesOfArchivedOrderMsg',
    defaultMessage: 'This will activate {batchesOfArchivedOrder}/{total} {batches} as well.',
  },
  batchesOfActiveOrderMsg: {
    id: 'modules.Shipments.form.activateDialog.batchesOfActiveOrderMsg',
    defaultMessage:
      '{batchesOfActiveOrder}/{total} {batches} are already active because they are in active {orders}.',
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
    id: 'global.shipment',
    defaultMessage: 'shipment',
  },
  shipments: {
    id: 'global.shipments',
    defaultMessage: 'shipments',
  },
});
