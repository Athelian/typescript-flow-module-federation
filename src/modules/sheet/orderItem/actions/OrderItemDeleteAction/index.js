// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { BaseButton } from 'components/Buttons';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { executeActionMutation, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, { BatchesLabelIcon, ItemLabelIcon } from 'components/Dialog/ActionDialog';
import messages from '../messages';
import deleteOrderItemActionMutation from './mutation';

const OrderItemDeleteAction = ({ entity, onDone }: ActionComponentProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [deleteOrderItem, { loading, called }] = useMutation(deleteOrderItemActionMutation);

  const onConfirm = () => {
    executeActionMutation(
      deleteOrderItem,
      {
        id: entity.id,
      },
      close
    );
  };

  let dialogMessage = null;
  let dialogSubMessage = null;

  if (loading || called) {
    dialogMessage = (
      <FormattedMessage {...messages.orderItemDeleting} values={{ icon: <ItemLabelIcon /> }} />
    );
  } else {
    dialogMessage = (
      <FormattedMessage {...messages.confirmOrderItemDelete} values={{ icon: <ItemLabelIcon /> }} />
    );
    dialogSubMessage = (
      <FormattedMessage
        {...messages.confirmOrderItemWithBatchesDelete}
        values={{ icon: <BatchesLabelIcon /> }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={loading || called}
      onCancel={close}
      title={<FormattedMessage {...messages.orderItemDeleteTitle} />}
      dialogMessage={dialogMessage}
      dialogSubMessage={dialogSubMessage}
      buttons={
        <BaseButton
          label={<FormattedMessage {...messages.orderItemDeleteButton} />}
          icon="REMOVE"
          onClick={onConfirm}
          backgroundColor="RED"
          hoverBackgroundColor="RED_DARK"
        />
      }
    />
  );
};

export default OrderItemDeleteAction;
