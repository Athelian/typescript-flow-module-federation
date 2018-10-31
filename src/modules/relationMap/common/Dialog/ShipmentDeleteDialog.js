// @flow
import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import DefaultDialog from 'components/Dialog/ArchiveDialog';
import { updateShipmentMutation } from 'modules/shipment/form/mutation';
import messages from 'modules/relationMap/messages';

type OptionalProps = {
  onConfirm: () => void,
};

const defaultProps = {
  onConfirm: () => {},
};

type Props = OptionalProps & {
  isOpen: boolean,
  onRequestClose: () => void,
  shipment: Object,
};

const ShipmentDeleteDialog = ({ isOpen, onRequestClose, shipment, onConfirm }: Props) => (
  <ApolloConsumer>
    {client => (
      <DefaultDialog
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        onCancel={onRequestClose}
        onConfirm={async () => {
          await client.mutate({
            mutation: updateShipmentMutation,
            variables: {
              id: shipment.id,
              input: {
                archived: true,
              },
            },
          });
          // emitter.emit('CHANGE_ORDER_STATUS', orderId);
          onRequestClose();
          onConfirm();
        }}
        width={360}
        message={<FormattedMessage {...messages.confirmDeleteShipment} />}
      />
    )}
  </ApolloConsumer>
);

ShipmentDeleteDialog.defaultProps = defaultProps;

export default ShipmentDeleteDialog;
