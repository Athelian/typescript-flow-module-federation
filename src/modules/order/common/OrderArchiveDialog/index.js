// @flow
import * as React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import ArchiveDialog from 'components/Dialog/ArchiveDialog';
import { updateOrderMutation } from 'modules/order/form/mutation';
import { getBatchesSummary } from 'modules/order/helpers';
import messages from './messages';
import type { OrderDialogProps } from '../OrderActivateDialog/type';
import { SpanStyle, MessageStyle } from '../OrderActivateDialog/style';

function spanWithColor(value: any, color: string) {
  return <span className={SpanStyle(color)}>{value}</span>;
}

export default function OrderArchiveDialog({ isOpen, onRequestClose, order }: OrderDialogProps) {
  const { totalBatches, unshippedBatches, shippedBatches } = getBatchesSummary(order);
  const { id: orderId } = order;
  const total = spanWithColor(<FormattedNumber value={totalBatches} />, 'GRAY_DARK');
  const unshipped = spanWithColor(<FormattedNumber value={unshippedBatches} />, 'BATCH');
  const shipped = spanWithColor(<FormattedNumber value={shippedBatches} />, 'BATCH');

  const orderMsg = spanWithColor(<FormattedMessage {...messages.order} />, 'RED');
  const batches = spanWithColor(<FormattedMessage {...messages.batches} />, 'BATCH');
  const shipments = spanWithColor(<FormattedMessage {...messages.shipments} />, 'SHIPMENT');

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
              mutation: updateOrderMutation,
              variables: {
                id: orderId,
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
                <FormattedMessage {...messages.confirmMsg} values={{ order: orderMsg }} />
              </div>
              <div>
                <FormattedMessage
                  {...messages.unshippedMsg}
                  values={{ unshipped, total, batches }}
                />
              </div>
              <div>
                <FormattedMessage
                  {...messages.shippedMsg}
                  values={{ shipped, total, batches, shipments }}
                />
              </div>
              <div>{warn}</div>
            </div>
          }
        />
      )}
    </ApolloConsumer>
  );
}
