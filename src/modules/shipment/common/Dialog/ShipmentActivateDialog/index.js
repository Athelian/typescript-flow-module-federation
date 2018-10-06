// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ApolloConsumer } from 'react-apollo';
import FormattedNumber from 'components/FormattedNumber';
import ActivateDialog from 'components/Dialog/ActivateDialog';
import { updateShipmentMutation } from 'modules/shipment/form/mutation';
import { getShipmentSummary } from 'modules/shipment/helpers';
import emitter from 'utils/emitter';
import { spanWithColor } from 'utils/color';
import messages from './messages';
import { type ShipmentDialogProps, defaultProps } from '../type';
import { MessageStyle } from '../style';

const ShipmentActivateDialog = ({
  isOpen,
  onRequestClose,
  onConfirm,
  shipment,
}: ShipmentDialogProps) => {
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
            emitter.emit('CHANGE_SHIPMENT_STATUS', shipmentId);
            onRequestClose();
            onConfirm();
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
              {unshippedBatches > 0 && (
                <div>
                  <FormattedMessage
                    {...messages.unshippedMsg}
                    values={{
                      total,
                      batches,
                      unshipped: spanWithColor(
                        <FormattedNumber value={unshippedBatches} />,
                        'BATCH'
                      ),
                    }}
                  />
                </div>
              )}
              {shippedBatches > 0 && (
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
              )}
            </div>
          }
        />
      )}
    </ApolloConsumer>
  );
};

ShipmentActivateDialog.defaultProps = defaultProps;

export default ShipmentActivateDialog;
