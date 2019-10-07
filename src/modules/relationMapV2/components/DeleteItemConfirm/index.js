// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { OrderFocused } from 'modules/relationMapV2/store';
import { BaseButton } from 'components/Buttons';
import ActionDialog, { ItemLabelIcon, BatchesLabelIcon } from '../ActionDialog';
import { deleteOrderItemMutation } from './mutation';

type Props = {|
  onSuccess: (itemId: string) => void,
|};

export default function DeleteItemConfirm({ onSuccess }: Props) {
  const [deleteItem] = useMutation(deleteOrderItemMutation);
  const { dispatch, state } = OrderFocused.useContainer();
  const {
    isProcessing,
    isOpen,
    type,
    detail: { entity },
  } = state.itemActions;
  const isDeleteItem = type === 'deleteItem';

  const onCancel = () => {
    dispatch({
      type: 'DELETE_ITEM_CLOSE',
      payload: {},
    });
  };

  const onConfirm = () => {
    dispatch({
      type: 'DELETE_ITEM_START',
      payload: {},
    });
    deleteItem({
      variables: {
        id: entity.id,
      },
    })
      .then(() => {
        onSuccess(entity.id);
      })
      .catch(() => {
        dispatch({
          type: 'DELETE_ITEM_CLOSE',
          payload: {},
        });
      });
  };

  let dialogMessage = null;
  let dialogSubMessage = null;

  if (isProcessing) {
    // Is currently deleting
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.deleteItem.deleting"
        defaultMessage="Deleting {itemLabel} ..."
        values={{ itemLabel: <ItemLabelIcon /> }}
      />
    );
  } else {
    // Has permission to delete
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.deleteItem.message1"
        defaultMessage="Are you sure you want to delete this {itemLabel}"
        values={{ itemLabel: <ItemLabelIcon /> }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        id="modules.RelationMap.deleteItem.message2"
        defaultMessage="All of their {batchesLabel} will be deleted as well"
        values={{
          batchesLabel: <BatchesLabelIcon />,
        }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen && isDeleteItem}
      isProcessing={isProcessing}
      onCancel={onCancel}
      title={<FormattedMessage id="modules.RelationMap.label.delete" defaultMessage="DELETE" />}
      dialogMessage={dialogMessage}
      dialogSubMessage={dialogSubMessage}
      buttons={
        <BaseButton
          label={<FormattedMessage id="modules.RelationMap.label.delete" defaultMessage="DELETE" />}
          icon="REMOVE"
          onClick={onConfirm}
          backgroundColor="RED"
          hoverBackgroundColor="RED_DARK"
        />
      }
    />
  );
}
