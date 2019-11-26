// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  orderItemCloneTitle: {
    id: 'modules.Sheet.orderItem.clone.title',
    defaultMessage: 'Clone',
  },
  orderItemCloneCloning: {
    id: 'modules.Sheet.orderItem.clone.cloning',
    defaultMessage: 'Cloning {icon} ...',
  },
  batchCreateTitle: {
    id: 'modules.Sheet.orderItem.createBatch.title',
    defaultMessage: 'Create Batch',
  },
  batchCreateCreating: {
    id: 'modules.Sheet.orderItem.createBatch.creating',
    defaultMessage: 'Creating {icon} ...',
  },
  orderItemDeleteTitle: {
    id: 'modules.Sheet.orderItem.delete.title',
    defaultMessage: 'Delete',
  },
  orderItemDeleting: {
    id: 'modules.Sheet.orderItem.delete.deleting',
    defaultMessage: 'Deleting {icon} ...',
  },
  confirmOrderItemDelete: {
    id: 'modules.Sheet.orderItem.delete.confirm',
    defaultMessage: 'Are you sure you want to delete this {icon} ?',
  },
  confirmOrderItemWithBatchesDelete: {
    id: 'modules.Sheet.orderItem.delete.confirmWithBatches',
    defaultMessage: 'All of their {icon} will be deleted as well.',
  },
  orderItemDeleteButton: {
    id: 'modules.Sheet.orderItem.delete.button',
    defaultMessage: 'Delete',
  },
});
