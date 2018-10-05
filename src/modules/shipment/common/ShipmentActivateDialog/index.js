// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ApolloConsumer } from 'react-apollo';
import ActivateDialog from 'components/Dialog/ActivateDialog';
import { updateShipmentMutation } from 'modules/shipment/form/mutation';
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
  const { id: shipmentId } = shipment;
  const shipmentMsg = spanWithColor(<FormattedMessage {...messages.shipment} />, 'RED');

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
              <div>
                <FormattedMessage {...messages.confirmMsg} values={{ shipment: shipmentMsg }} />
              </div>
            </div>
          }
        />
      )}
    </ApolloConsumer>
  );
}
