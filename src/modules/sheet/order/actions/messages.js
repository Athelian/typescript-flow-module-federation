// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  batchesAutofillTitle: {
    id: 'modules.Sheet.order.batchesAutofill.title',
    defaultMessage: 'Autofill',
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
      'No {itemsLabel} of the order have more quantity than the sum of their {batchesLabel} quantities.',
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
