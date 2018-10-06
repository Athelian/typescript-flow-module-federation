// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ApolloConsumer } from 'react-apollo';
import ActivateDialog from 'components/Dialog/ActivateDialog';
import { updateProductMutation } from 'modules/product/form/mutation';
import { spanWithColor } from 'utils/color';
import emitter from 'utils/emitter';
import messages from './messages';
import { type ProductDialogProps, defaultProps } from '../type';
import { MessageStyle } from '../style';

const ProductActivateDialog = ({
  isOpen,
  onRequestClose,
  onConfirm,
  product,
}: ProductDialogProps) => {
  const { id: productId } = product;
  const productMsg = spanWithColor(<FormattedMessage {...messages.product} />, 'RED');

  return (
    <ApolloConsumer>
      {client => (
        <ActivateDialog
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          onCancel={onRequestClose}
          onConfirm={async () => {
            await client.mutate({
              mutation: updateProductMutation,
              variables: {
                id: productId,
                input: {
                  archived: false,
                },
              },
            });
            emitter.emit('CHANGE_PRODUCT_STATUS', productId);
            onRequestClose();
            onConfirm();
          }}
          width={360}
          message={
            <div className={MessageStyle}>
              <div>
                <FormattedMessage {...messages.confirmMsg} values={{ product: productMsg }} />
              </div>
            </div>
          }
        />
      )}
    </ApolloConsumer>
  );
};

ProductActivateDialog.defaultProps = defaultProps;

export default ProductActivateDialog;
