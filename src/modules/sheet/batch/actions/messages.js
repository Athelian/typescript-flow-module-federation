// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  batchCloneTitle: {
    id: 'modules.Sheet.batch.clone.title',
    defaultMessage: 'Clone',
  },
  batchCloneCloning: {
    id: 'modules.Sheet.batch.clone.cloning',
    defaultMessage: 'Cloning {icon} ...',
  },
  batchSyncPackagingTitle: {
    id: 'modules.Sheet.batch.syncPackaging.title',
    defaultMessage: 'Sync Packaging',
  },
  batchSyncPackagingMessage: {
    id: 'modules.Sheet.batch.syncPackaging.message',
    defaultMessage:
      'Please choose a package from the {endProductLabel} to load into your {batchLabel}',
  },
  batchSyncPackagingSyncing: {
    id: 'modules.Sheet.batch.syncPackaging.syncing',
    defaultMessage: 'Syncing {batchLabel} ...',
  },
  batchSyncPackagingSyncButton: {
    id: 'modules.Sheet.batch.syncPackaging.syncButton',
    defaultMessage: 'Sync',
  },
  batchRemoveDeleteTitle: {
    id: 'modules.Sheet.batch.deleteRemove.title',
    defaultMessage: 'Delete / Remove',
  },
  batchDeleting: {
    id: 'modules.Sheet.batch.deleteRemove.deleting',
    defaultMessage: 'Deleting {icon} ...',
  },
  batchRemoving: {
    id: 'modules.Sheet.batch.deleteRemove.removing',
    defaultMessage: 'Removing {icon} ...',
  },
  confirmBatchDelete: {
    id: 'modules.Sheet.batch.deleteRemove.confirm',
    defaultMessage: 'Are you sure you want to delete or remove this {icon} ?',
  },
  batchDeleteButton: {
    id: 'modules.Sheet.batch.deleteRemove.deleteButton',
    defaultMessage: 'Delete',
  },
  batchRemoveButton: {
    id: 'modules.Sheet.batch.deleteRemove.removeButton',
    defaultMessage: 'Remove from {icon}',
  },
});
