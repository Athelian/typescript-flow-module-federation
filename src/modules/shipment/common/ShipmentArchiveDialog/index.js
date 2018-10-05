// @flow
import * as React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import ArchiveDialog from 'components/Dialog/ArchiveDialog';
import { updateShipmentMutation } from 'modules/shipment/form/mutation';
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
  const { id: shipmentId } = shipment;

  const shipmentMsg = spanWithColor(<FormattedMessage {...messages.shipment} />, 'RED');
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
                <FormattedMessage {...messages.confirmMsg} values={{ shipment: shipmentMsg }} />
              </div>
              <div>{warn}</div>
            </div>
          }
        />
      )}
    </ApolloConsumer>
  );
}
