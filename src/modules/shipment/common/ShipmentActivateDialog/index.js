// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ApolloConsumer } from 'react-apollo';
import FormattedNumber from 'components/FormattedNumber';
import ActivateDialog from 'components/Dialog/ActivateDialog';
import { updateShipmentMutation } from 'modules/shipment/form/mutation';
import { getShipmentSummary } from 'modules/shipment/helpers';
import type { ShipmentDialogProps } from './type';
import messages from './messages';
import { SpanStyle, MessageStyle } from './style';

function spanWithColor(value: any, color: string) {
  return <span className={SpanStyle(color)}>{value}</span>;
}

export default function ShipmentActivateDialog({
  isOpen,
  onRequestClose,
  shipment,
}: ShipmentDialogProps) {
  const { totalBatches, unshippedBatches, shippedBatches } = getShipmentSummary(shipment);
  const { id: shipmentId } = shipment;
  const total = spanWithColor(<FormattedNumber value={totalBatches} />, 'GRAY_DARK');
  const batches = spanWithColor(<FormattedMessage {...messages.batches} />, 'BATCH');

  return (
    <ApolloConsumer>
      {client => (
        <ActivateDialog
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          onCancel={onRequestClose}
          onConfirm={async () => {
            await client.mutate({
              mutation: updateShipmentMutation,
              variables: {
                id: shipmentId,
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
              <FormattedMessage
                {...messages.confirmMsg}
                values={{
                  shipment: spanWithColor(<FormattedMessage {...messages.shipment} />, 'RED'),
                }}
              />
              <div>
                <FormattedMessage
                  {...messages.unshippedMsg}
                  values={{
                    total,
                    batches,
                    unshipped: spanWithColor(<FormattedNumber value={unshippedBatches} />, 'BATCH'),
                  }}
                />
              </div>
              <div>
                <FormattedMessage
                  {...messages.shippedMsg}
                  values={{
                    total,
                    batches,
                    shipped: spanWithColor(<FormattedNumber value={shippedBatches} />, 'BATCH'),
                    orders: spanWithColor(<FormattedMessage {...messages.orders} />, 'ORDER'),
                  }}
                />
              </div>
            </div>
          }
        />
      )}
    </ApolloConsumer>
  );
}
