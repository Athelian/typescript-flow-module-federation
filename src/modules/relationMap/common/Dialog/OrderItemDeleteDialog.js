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
  orderItem: Object,
};

const OrderItemDeleteDialog = ({ isOpen, onRequestClose, orderItem, onConfirm }: Props) => (
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
              id: orderItem.orderId,
            },
          });
          const removedOrderItems = order.orderItems.filter(item => item.id !== orderItem.id);
          await client.mutate({
            mutation: updateOrderMutation,
            variables: {
              id: orderItem.orderId,
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
        message="Confirm To delete Order item"
      />
    )}
  </ApolloConsumer>
);

OrderItemDeleteDialog.defaultProps = defaultProps;

export default OrderItemDeleteDialog;
