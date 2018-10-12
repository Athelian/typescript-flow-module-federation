// @flow
import { defineMessages } from 'react-intl';

export default defineMessages({
  confirmMsg: {
    id: 'modules.product.form.activateDialog.confirmMsg',
    defaultMessage: 'Are you sure you want to activate this {product}?',
  },
  warnMsg: {
    id: 'modules.product.form.activateDialog.warnMsg',
    defaultMessage: 'This will activate all {total} {providers} as well.',
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
