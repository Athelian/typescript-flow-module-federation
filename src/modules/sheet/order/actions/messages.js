// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  syncAllPricesTitle: {
    id: 'modules.Sheet.order.syncAllPrices.title',
    defaultMessage: 'Sync All Prices',
  },
  syncAllPricesSyncButton: {
    id: 'modules.Sheet.order.syncAllPrices.syncButton',
    defaultMessage: 'Sync',
  },
  syncAllPricesSyncing: {
    id: 'modules.Sheet.order.syncAllPrices.syncing',
    defaultMessage: 'Syncing {numOfValidItems} {itemsLabel} ...',
  },
  syncAllPricesMessage: {
    id: 'modules.Sheet.order.syncAllPrices.message',
    defaultMessage:
      '{numOfValidItems} / {numOfItems} {itemsLabel} are able to load the prices from their {endProductsLabel}. Would you like to sync the prices?',
  },
  syncAllPricesRestrictedMessage: {
    id: 'modules.Sheet.order.syncAllPrices.restrictedMessage',
    defaultMessage:
      'Sorry, you cannot load any prices from the {endProductsLabel} into the {itemsLabel} because every currency is mismatched',
  },
  batchesAutofillTitle: {
    id: 'modules.Sheet.order.batchesAutofill.title',
    defaultMessage: 'Autofill Batches',
  },
  batchesAutofillButton: {
    id: 'modules.Sheet.order.batchesAutofill.button',
    defaultMessage: 'Autofill',
  },
  batchesAutofilling: {
    id: 'modules.Sheet.order.batchesAutofill.autofilling',
    defaultMessage: 'Autofilling {numOfItems} {itemsLabel} ...',
  },
  batchesAutofillNone: {
    id: 'modules.Sheet.order.batchesAutofill.none',
    defaultMessage:
      'Sorry, you cannot autofill any {itemsLabel} because none of them have quantity more than the sum of quantities of their {batchesLabel}',
  },
  batchesAutofillConfirm: {
    id: 'modules.Sheet.order.batchesAutofill.confirm',
    defaultMessage:
      'Are you sure you want to autofill {numOfValidItems} / {numOfItems} {itemsLabel} that you have selected?',
  },
  batchesAutofillSubConfirm: {
    id: 'modules.Sheet.order.batchesAutofill.subConfirm',
    defaultMessage:
      'This will create a {batchLabel} for each {itemLabel} with its quantity set as the remaining quantity of the {itemLabel}. Only {itemsLabel} with quantities higher than the sum of quantities of their {batchesLabel} can be autofilled.',
  },
  orderItemCreateTitle: {
    id: 'modules.Sheet.order.orderItemCreate.title',
    defaultMessage: 'Create Item',
  },
});
