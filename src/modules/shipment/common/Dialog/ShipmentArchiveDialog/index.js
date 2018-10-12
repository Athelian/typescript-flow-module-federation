// @flow
import * as React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import ArchiveDialog from 'components/Dialog/ArchiveDialog';
import { updateShipmentMutation } from 'modules/shipment/form/mutation';
import { getShipmentSummary } from 'modules/shipment/helpers';
import { spanWithColor } from 'utils/color';
import emitter from 'utils/emitter';
import messages from './messages';
import { type ShipmentDialogProps, defaultProps } from '../type';
import { MessageStyle } from '../style';

const ShipmentArchiveDialog = ({
  isOpen,
  onRequestClose,
  onConfirm,
  shipment,
}: ShipmentDialogProps) => {
  const { totalBatches, batchesOfActiveOrder, batchesOfArchivedOrder } = getShipmentSummary(
    shipment
  );
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
            await client.mutate({
              mutation: updateShipmentMutation,
              variables: {
                id: shipmentId,
                input: {
                  archived: true,
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
                    shipment: spanWithColor(
                      <FormattedMessage {...messages.shipment} />,
                      'SHIPMENT'
                    ),
                  }}
                />
              </div>
              {batchesOfArchivedOrder > 0 && (
                <div>
                  <FormattedMessage
                    {...messages.batchesOfArchivedOrderMsg}
                    values={{
                      total,
                      batches,
                      batchesOfArchivedOrder: spanWithColor(
                        <FormattedNumber value={batchesOfArchivedOrder} />,
                        'BATCH'
                      ),
                    }}
                  />
                </div>
              )}
              {batchesOfActiveOrder > 0 && (
                <>
                  <div>
                    <FormattedMessage
                      {...messages.batchesOfActiveOrderMsg}
                      values={{
                        total,
                        batches,
                        batchesOfActiveOrder: spanWithColor(
                          <FormattedNumber value={batchesOfActiveOrder} />,
                          'BATCH'
                        ),
                        orders: spanWithColor(<FormattedMessage {...messages.orders} />, 'ORDER'),
                      }}
                    />
                  </div>
                  <div>
                    {spanWithColor(<FormattedMessage {...messages.warnMsg} />, 'GRAY_DARK')}
                  </div>
                </>
              )}
            </div>
          }
        />
      )}
    </ApolloConsumer>
  );
};

ShipmentArchiveDialog.defaultProps = defaultProps;

export default ShipmentArchiveDialog;
