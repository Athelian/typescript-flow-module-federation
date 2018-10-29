// @flow
import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import DefaultDialog from 'components/Dialog/ArchiveDialog';
import { orderFormQuery } from 'modules/order/form/query';
import { updateOrderMutation, prepareUpdateOrderInput } from 'modules/order/form/mutation';
import { removeTypename } from 'utils/data';

type OptionalProps = {
  onConfirm: () => void,
};

const defaultProps = {
  onConfirm: () => {},
};

type Props = OptionalProps & {
  isOpen: boolean,
  onRequestClose: () => void,
  batch: Object,
};

const BatchDeleteDialog = ({ isOpen, onRequestClose, batch, onConfirm }: Props) => (
  <ApolloConsumer>
    {client => (
      <DefaultDialog
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        onCancel={onRequestClose}
        onConfirm={async () => {
          const {
            data: { order = {} },
            // $FlowFixMe
          } = await client.query({
            query: orderFormQuery,
            variables: {
              id: batch.orderId,
            },
          });
          const removedOrderItems = order.orderItems.map(item => {
            const removedBatch =
              batch.orderItemId === item.id
                ? item.batches.filter(currentBatch => currentBatch.id !== batch.id)
                : item.batches;
            return {
              ...item,
              batches: removedBatch,
            };
          });
          await client.mutate({
            mutation: updateOrderMutation,
            variables: {
              id: batch.orderId,
              input: removeTypename(
                prepareUpdateOrderInput({
                  ...order,
                  orderItems: removedOrderItems,
                })
              ),
            },
          });
          onRequestClose();
          onConfirm();
        }}
        width={360}
        message="Confirm To delete batch"
      />
    )}
  </ApolloConsumer>
);

BatchDeleteDialog.defaultProps = defaultProps;

export default BatchDeleteDialog;
