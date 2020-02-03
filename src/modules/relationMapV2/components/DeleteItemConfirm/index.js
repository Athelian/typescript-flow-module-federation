// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { FocusedView } from 'modules/relationMapV2/store';
import { BaseButton } from 'components/Buttons';
import ActionDialog, { ItemLabelIcon, BatchesLabelIcon } from 'components/Dialog/ActionDialog';
import DocumentsDeleteDialog from 'components/Dialog/DocumentsDeleteDialog';
import { deleteManyFileMutation } from 'modules/document/mutation';
import { deleteOrderItemMutation } from './mutation';
import { itemQuery } from './query';

type Props = {|
  onSuccess: (itemId: string) => void,
|};

export default function DeleteItemConfirm({ onSuccess }: Props) {
  const [step, setStep] = React.useState(1);
  const { dispatch, state } = FocusedView.useContainer();
  const {
    isProcessing,
    isOpen,
    type,
    detail: { entity },
  } = state.itemActions;
  const itemQueryResult = useQuery(itemQuery, {
    variables: {
      id: entity.id,
    },
  });
  const [deleteItem] = useMutation(deleteOrderItemMutation);
  const [deleteItemFiles] = useMutation(deleteManyFileMutation);
  const isDeleteItem = type === 'deleteItem';

  const onCancel = () => {
    dispatch({
      type: 'DELETE_ITEM_CLOSE',
      payload: {},
    });
    setStep(0);
  };

  const deleteItemHandler = React.useCallback(() => {
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
        setStep(0);
      })
      .catch(() => {
        dispatch({
          type: 'DELETE_ITEM_CLOSE',
          payload: {},
        });
      });
  }, [deleteItem, dispatch, entity.id, onSuccess]);

  const onConfirm = () => {
    const files = itemQueryResult.data?.orderItem?.files ?? [];
    if (files.length) {
      setStep(2);
    } else {
      deleteItemHandler();
    }
  };

  let dialogMessage = null;
  let dialogSubMessage = null;

  if (isProcessing) {
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.deleteItem.deleting"
        defaultMessage="Deleting {itemLabel} ..."
        values={{ itemLabel: <ItemLabelIcon /> }}
      />
    );
  } else if (itemQueryResult.loading) {
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.deleteItem.loading"
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

  const files = itemQueryResult.data?.orderItem?.files ?? [];
  if (step === 2 && files.length > 0) {
    return (
      <DocumentsDeleteDialog
        files={files}
        isOpen
        entityType="ITEM"
        onCancel={onCancel}
        onKeep={deleteItemHandler}
        onDelete={() => {
          deleteItemHandler();
          deleteItemFiles({
            variables: {
              ids: files.map(file => file.id),
            },
          });
        }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen && isDeleteItem}
      isProcessing={isProcessing || itemQueryResult.loading}
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
