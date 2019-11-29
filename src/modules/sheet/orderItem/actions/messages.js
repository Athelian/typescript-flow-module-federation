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
  orderItemSyncPriceTitle: {
    id: 'modules.Sheet.orderItem.syncPrice.title',
    defaultMessage: 'Sync Price',
  },
  orderItemSyncPriceMessage: {
    id: 'modules.Sheet.orderItem.syncPrice.message',
    defaultMessage:
      'Are you sure you want to load the following price from the {endProductLabel} into this {orderItemLabel} ?',
  },
  orderItemSyncPriceRestrictedMessage: {
    id: 'modules.Sheet.orderItem.syncPrice.restrictedMessage',
    defaultMessage:
      'Sorry, you cannot load the following price from the {endProductLabel} into this {orderItemLabel} because their currencies are mismatched',
  },
  orderItemSyncPriceEndProductLabel: {
    id: 'modules.Sheet.orderItem.syncPrice.endProductLabel',
    defaultMessage: `End Product's Unit Price`,
  },
  orderItemSyncPriceSyncing: {
    id: 'modules.Sheet.orderItem.syncPrice.syncing',
    defaultMessage: 'Syncing {orderItemLabel} ...',
  },
  orderItemSyncPriceSyncButton: {
    id: 'modules.Sheet.orderItem.syncPrice.syncButton',
    defaultMessage: 'Sync',
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
  orderItemAutofillTitle: {
    id: 'modules.Sheet.orderItem.autofill.title',
    defaultMessage: 'Autofill Batch',
  },
  orderItemAutofillButton: {
    id: 'modules.Sheet.orderItem.autofill.button',
    defaultMessage: 'Autofill',
  },
  orderItemAutofillAutofilling: {
    id: 'modules.Sheet.orderItem.autofill.autofilling',
    defaultMessage: 'Autofilling {batchLabel} ...',
  },
  orderItemAutofillRestrictedMessage: {
    id: 'modules.Sheet.orderItem.autofill.restrictedMessage',
    defaultMessage:
      'Sorry, you cannot autofill this {itemLabel} because it has less quantity than the total quantity of its {batchesLabel}',
  },
  orderItemAutofillMessage: {
    id: 'modules.Sheet.orderItem.autofill.message',
    defaultMessage: 'Are you sure you want to autofill this {itemLabel} ?',
  },
  orderItemAutofillSubMessage: {
    id: 'modules.Sheet.orderItem.autofill.subMessage',
    defaultMessage:
      'This will create a {batchLabel} with its quantity set as the remaining quantity of the {itemLabel}',
  },
});
