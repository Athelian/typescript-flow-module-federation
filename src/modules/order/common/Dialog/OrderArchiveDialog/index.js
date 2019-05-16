// @flow
import * as React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import ArchiveDialog from 'components/Dialog/ArchiveDialog';
import { updateOrderMutation } from 'modules/order/form/mutation';
import { calculateBatchesFromOrder } from 'modules/order/helpers';
import { spanWithColor } from 'utils/color';
import emitter from 'utils/emitter';
import messages from './messages';
import { type OrderDialogProps, defaultProps } from '../type';
import { MessageStyle } from '../style';

const OrderArchiveDialog = ({ isOpen, onRequestClose, order, onConfirm }: OrderDialogProps) => {
  const { totalBatches, unshippedBatches, shippedBatches } = calculateBatchesFromOrder(order);
  const { id: orderId = '', orderItemCount = 0 } = order || {};
  const total = spanWithColor(<FormattedNumber value={totalBatches} />, 'GRAY_DARK');
  const items = spanWithColor(<FormattedMessage {...messages.items} />, 'ORDER_ITEM');
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
              mutation: updateOrderMutation,
              variables: {
                id: orderId,
                input: {
                  archived: true,
                },
              },
            });
            emitter.emit('CHANGE_ORDER_STATUS', orderId);
            onRequestClose();
            onConfirm();
          }}
          message={
            <div className={MessageStyle}>
              <div>
                <FormattedMessage
                  {...messages.confirmMsg}
                  values={{
                    order: spanWithColor(<FormattedMessage {...messages.order} />, 'ORDER'),
                  }}
                />
              </div>

              {orderItemCount > 0 && (
                <div>
                  <FormattedMessage
                    {...messages.makeItemsArchived}
                    values={{
                      orderItemCount: spanWithColor(
                        <FormattedNumber value={orderItemCount} />,
                        'ORDER_ITEM'
                      ),
                      items,
                    }}
                  />
                </div>
              )}

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
                <>
                  <div>
                    <FormattedMessage
                      {...messages.shippedMsg}
                      values={{
                        total,
                        batches,
                        shipped: spanWithColor(<FormattedNumber value={shippedBatches} />, 'BATCH'),
                        shipments: spanWithColor(
                          <FormattedMessage {...messages.shipments} />,
                          'SHIPMENT'
                        ),
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

OrderArchiveDialog.defaultProps = defaultProps;

export default OrderArchiveDialog;
