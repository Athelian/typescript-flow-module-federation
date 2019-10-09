// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { FocusedView } from 'modules/relationMapV2/store';
import { BaseButton } from 'components/Buttons';
import ActionDialog, { BatchLabelIcon } from '../ActionDialog';
import { deleteBatchMutation } from './mutation';

type Props = {|
  onSuccess: (batchId: string) => void,
|};

export default function DeleteBatchConfirm({ onSuccess }: Props) {
  const [deleteBatch] = useMutation(deleteBatchMutation);
  const { dispatch, state } = FocusedView.useContainer();
  const {
    isProcessing,
    isOpen,
    type,
    detail: { entity },
  } = state.batchActions;

  const isDeleteBatch = type === 'deleteBatch';

  const onCancel = () => {
    dispatch({
      type: 'DELETE_BATCH_CLOSE',
      payload: {},
    });
  };

  const onConfirm = () => {
    dispatch({
      type: 'DELETE_BATCH_START',
      payload: {},
    });
    deleteBatch({
      variables: {
        id: entity.id,
      },
    })
      .then(() => {
        onSuccess(entity.id);
      })
      .catch(() => {
        dispatch({
          type: 'DELETE_BATCH_CLOSE',
          payload: {},
        });
      });
  };

  let dialogMessage = null;

  if (isProcessing) {
    // Is currently deleting
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.deleteBatch.deleting"
        defaultMessage="Deleting {batchLabel} ..."
        values={{ batchLabel: <BatchLabelIcon /> }}
      />
    );
  } else {
    // Has permission to delete
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.deleteBatch.message1"
        defaultMessage="Are you sure you want to delete this {batchLabel}"
        values={{ batchLabel: <BatchLabelIcon /> }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen && isDeleteBatch}
      isProcessing={isProcessing}
      onCancel={onCancel}
      title={<FormattedMessage id="modules.RelationMap.label.delete" defaultMessage="DELETE" />}
      dialogMessage={dialogMessage}
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
