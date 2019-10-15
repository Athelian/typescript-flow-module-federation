// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { FocusedView } from 'modules/relationMapV2/store';
import { BaseButton } from 'components/Buttons';
import ActionDialog, { ContainerLabelIcon, BatchesLabelIcon } from '../ActionDialog';
import { deleteContainerMutation } from './mutation';

type Props = {|
  onSuccess: (containerId: string) => void,
|};

export default function DeleteContainerConfirm({ onSuccess }: Props) {
  const [deleteContainer] = useMutation(deleteContainerMutation);
  const { dispatch, state } = FocusedView.useContainer();
  const {
    isProcessing,
    isOpen,
    detail: { entity },
  } = state.containerActions;

  const onCancel = () => {
    dispatch({
      type: 'DELETE_CONTAINER_CLOSE',
      payload: {},
    });
  };

  const onConfirm = () => {
    dispatch({
      type: 'DELETE_CONTAINER_START',
      payload: {},
    });
    deleteContainer({
      variables: {
        id: entity.id,
      },
    })
      .then(() => {
        onSuccess(entity.id);
      })
      .catch(() => {
        dispatch({
          type: 'DELETE_CONTAINER_CLOSE',
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
        id="modules.RelationMap.deleteContainer.deleting"
        defaultMessage="Deleting {containerLabel} ..."
        values={{ containerLabel: <ContainerLabelIcon /> }}
      />
    );
  } else {
    // Has permission to delete
    dialogMessage = (
      <FormattedMessage
        id="modules.RelationMap.deleteContainer.message1"
        defaultMessage="Are you sure you want to delete this {containerLabel}"
        values={{ containerLabel: <ContainerLabelIcon /> }}
      />
    );
    dialogSubMessage = (
      <FormattedMessage
        id="modules.RelationMap.deleteContainer.message2"
        defaultMessage="All of their {batchesLabel} will be moved to the Shipment's Batch Pool"
        values={{
          batchesLabel: <BatchesLabelIcon />,
        }}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen}
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
