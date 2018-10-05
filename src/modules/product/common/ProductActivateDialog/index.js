// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ApolloConsumer } from 'react-apollo';
import ActivateDialog from 'components/Dialog/ActivateDialog';
import { updateProductMutation } from 'modules/product/form/mutation';
import type { ProductDialogProps } from './type';
import messages from './messages';
import { SpanStyle, MessageStyle } from './style';

function spanWithColor(value: any, color: string) {
  return <span className={SpanStyle(color)}>{value}</span>;
}

export default function ProductActivateDialog({
  isOpen,
  onRequestClose,
  product,
}: ProductDialogProps) {
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
            window.location.reload();
            onRequestClose();
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
}
