// @flow
import * as React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import ArchiveDialog from 'components/Dialog/ArchiveDialog';
import { updateProductMutation } from 'modules/product/form/mutation';
import { spanWithColor } from 'utils/color';
import emitter from 'utils/emitter';
import messages from './messages';
import { type ProductDialogProps, defaultProps } from '../type';
import { MessageStyle } from '../style';

const ProductArchiveDialog = ({
  isOpen,
  onRequestClose,
  onConfirm,
  product,
}: ProductDialogProps) => {
  const { id: productId, productProviders } = product;
  const productMsg = spanWithColor(<FormattedMessage {...messages.product} />, 'PRODUCT');

  return (
    <ApolloConsumer>
      {client => (
        <ArchiveDialog
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          onCancel={onRequestClose}
          onConfirm={async () => {
            await client.mutate({
              mutation: updateProductMutation,
              variables: {
                id: productId,
                input: {
                  archived: true,
                },
              },
            });
            emitter.emit('CHANGE_PRODUCT_STATUS', productId);
            onRequestClose();
            onConfirm();
          }}
          message={
            <div className={MessageStyle}>
              <div>
                <FormattedMessage {...messages.confirmMsg} values={{ product: productMsg }} />
              </div>
              <div>
                <FormattedMessage
                  {...messages.warnMsg}
                  values={{
                    total: (productProviders || []).length,
                    providers: spanWithColor(
                      <FormattedMessage {...messages.providers} />,
                      'PRODUCT_PROVIDER'
                    ),
                  }}
                />
              </div>
            </div>
          }
        />
      )}
    </ApolloConsumer>
  );
};

ProductArchiveDialog.defaultProps = defaultProps;

export default ProductArchiveDialog;
