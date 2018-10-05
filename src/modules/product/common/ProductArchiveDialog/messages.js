// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  confirmMsg: {
    id: 'modules.product.form.archiveDialog.confirmMsg',
    defaultMessage: 'Are you sure you want to archive this {product}?',
  },
  warnMsg: {
    id: 'modules.product.form.archiveDialog.warnMsg',
    defaultMessage: 'You need to archive those shipments in product to archive these batches.',
  },
  product: {
    id: 'modules.product.form.dialog.product',
    defaultMessage: 'product',
  },
});
