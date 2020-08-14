// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  confirmMsg: {
    id: 'modules.Products.form.archiveDialog.confirmMsg',
    defaultMessage: 'Are you sure you want to archive this {product}?',
  },
  warnMsg: {
    id: 'modules.Products.form.archiveDialog.warnMsg',
    defaultMessage: 'This will make all {total} {providers} archived as well.',
  },
  product: {
    id: 'global.product',
    defaultMessage: 'product',
  },
  providers: {
    id: 'global.providers',
    defaultMessage: 'end products',
  },
});