// @flow
import * as React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import ArchiveDialog from 'components/Dialog/ArchiveDialog';
import { updateProductMutation } from 'modules/product/form/mutation';
import messages from './messages';
import type { ProductDialogProps } from '../ProductActivateDialog/type';
import { SpanStyle, MessageStyle } from '../ProductActivateDialog/style';

function spanWithColor(value: any, color: string) {
  return <span className={SpanStyle(color)}>{value}</span>;
}

export default function ProductArchiveDialog({
  isOpen,
  onRequestClose,
  product,
}: ProductDialogProps) {
  const { id: productId } = product;
  const productMsg = spanWithColor(<FormattedMessage {...messages.product} />, 'RED');
  const warn = spanWithColor(<FormattedMessage {...messages.warnMsg} />, 'GRAY_DARK');

  return (
    <ApolloConsumer>
      {client => (
        <ArchiveDialog
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          onCancel={onRequestClose}
          onConfirm={async () => {
            const result = await client.mutate({
              mutation: updateProductMutation,
              variables: {
                id: productId,
                input: {
                  archived: true,
                },
              },
            });
            window.location.reload();
            onRequestClose();
            console.warn('result', result);
          }}
          width={360}
          message={
            <div className={MessageStyle}>
              <div>
                <FormattedMessage {...messages.confirmMsg} values={{ product: productMsg }} />
              </div>
              <div>{warn}</div>
            </div>
          }
        />
      )}
    </ApolloConsumer>
  );
}
