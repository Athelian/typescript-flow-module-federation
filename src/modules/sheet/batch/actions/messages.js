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
  batchSplitTitle: {
    id: 'modules.Sheet.batch.split.title',
    defaultMessage: 'Split',
  },
  batchSplitSplitting: {
    id: 'modules.Sheet.batch.split.splitting',
    defaultMessage: 'Splitting {batchLabel} ...',
  },
  batchSplitNotEnoughQuantity: {
    id: 'modules.Sheet.batch.split.notEnoughQuantity',
    defaultMessage:
      'Sorry, you cannot split this {batchLabel} because its quantity is not greater than 0',
  },
  batchSplitMessage: {
    id: 'modules.Sheet.batch.split.message',
    defaultMessage: 'Please enter the quantity that you would like to split by',
  },
  batchSplitSubMessage: {
    id: 'modules.Sheet.batch.split.subMessage',
    defaultMessage: 'You cannot split by more than the quantity of the {batchLabel}',
  },
  batchSplitButton: {
    id: 'modules.Sheet.batch.split.button',
    defaultMessage: 'Split',
  },
  batchSplitInto: {
    id: 'modules.Sheet.batch.split.into',
    defaultMessage: 'Quantity to Split Into',
  },
  batchSplitValidatorError: {
    id: 'modules.Sheet.batch.split.validatorError',
    defaultMessage: 'Please enter the number between {min} and {max}',
  },
  batchMoveToExistingOrderTitle: {
    id: 'modules.Sheet.batch.batchMoveToExistingOrder.title',
    defaultMessage: 'Move to Order',
  },
  batchMoveToNewOrderTitle: {
    id: 'modules.Sheet.batch.batchMoveToNewOrderTitle.title',
    defaultMessage: 'Move to New Order',
  },
  batchMoveToExistingContainerTitle: {
    id: 'modules.Sheet.batch.batchMoveToExistingContainer.title',
    defaultMessage: 'Move to Container',
  },
});
