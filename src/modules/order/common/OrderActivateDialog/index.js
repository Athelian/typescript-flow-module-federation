// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ApolloConsumer } from 'react-apollo';
import FormattedNumber from 'components/FormattedNumber';
import ActivateDialog from 'components/Dialog/ActivateDialog';
import { updateOrderMutation } from 'modules/order/form/mutation';
import { getBatchesSummary } from 'modules/order/helpers';
import type { OrderDialogProps } from './type';
import messages from './messages';
import { SpanStyle, MessageStyle } from './style';

function spanWithColor(value: any, color: string) {
  return <span className={SpanStyle(color)}>{value}</span>;
}

export default function OrderActivateDialog({ isOpen, onRequestClose, order }: OrderDialogProps) {
  const { totalBatches, unshippedBatches, shippedBatches } = getBatchesSummary(order);
  const { id: orderId } = order;
  const total = spanWithColor(<FormattedNumber value={totalBatches} />, 'GRAY');
  const unshipped = spanWithColor(<FormattedNumber value={unshippedBatches} />, 'BATCH');
  const shipped = spanWithColor(<FormattedNumber value={shippedBatches} />, 'BATCH');
  const orderMsg = spanWithColor(<FormattedMessage {...messages.order} />, 'RED');
  const batchesMsg = spanWithColor(<FormattedMessage {...messages.batches} />, 'BATCH');
  const shipmentsMsg = spanWithColor(<FormattedMessage {...messages.shipments} />, 'SHIPMENT');

  return (
    <ApolloConsumer>
      {client => (
        <ActivateDialog
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          onCancel={onRequestClose}
          onConfirm={async () => {
            await client.mutate({
              mutation: updateOrderMutation,
              variables: {
                id: orderId,
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
                <FormattedMessage {...messages.confirmMsg} values={{ order: orderMsg }} />
              </div>
              <div>
                <FormattedMessage
                  {...messages.unshippedMsg}
                  values={{ unshipped, total, batches: batchesMsg }}
                />
              </div>
              <div>
                <FormattedMessage
                  {...messages.shippedMsg}
                  values={{ shipped, total, batches: batchesMsg, shipments: shipmentsMsg }}
                />
              </div>
            </div>
          }
        />
      )}
    </ApolloConsumer>
  );
}
