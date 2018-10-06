// @flow
import * as React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import ArchiveDialog from 'components/Dialog/ArchiveDialog';
import { updateShipmentMutation } from 'modules/shipment/form/mutation';
import { getShipmentSummary } from 'modules/shipment/helpers';
import messages from './messages';
import type { ShipmentDialogProps } from '../ShipmentActivateDialog/type';
import { SpanStyle, MessageStyle } from '../ShipmentActivateDialog/style';

function spanWithColor(value: any, color: string) {
  return <span className={SpanStyle(color)}>{value}</span>;
}

export default function ShipmentArchiveDialog({
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
        <ArchiveDialog
          isOpen={isOpen}
          onRequestClose={onRequestClose}
          onCancel={onRequestClose}
          onConfirm={async () => {
            const result = await client.mutate({
              mutation: updateShipmentMutation,
              variables: {
                id: shipmentId,
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
                <FormattedMessage
                  {...messages.confirmMsg}
                  values={{
                    shipment: spanWithColor(<FormattedMessage {...messages.shipment} />, 'RED'),
                  }}
                />
              </div>
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
              <div>{spanWithColor(<FormattedMessage {...messages.warnMsg} />, 'GRAY_DARK')}</div>
            </div>
          }
        />
      )}
    </ApolloConsumer>
  );
}
