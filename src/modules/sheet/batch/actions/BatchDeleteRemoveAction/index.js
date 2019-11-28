// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { BaseButton } from 'components/Buttons';
import Icon from 'components/Icon';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { executeActionMutation, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, { BatchLabelIcon } from 'components/Dialog/ActionDialog';
import messages from '../messages';
import {
  deleteBatchActionMutation,
  removeBatchFromShipmentActionMutation,
  removeBatchFromContainerActionMutation,
} from './mutation';

type Props = {|
  hasShipment: (batchId: string, item: Object) => boolean,
  hasContainer: (batchId: string, item: Object) => boolean,
|};

type ImplProps = {|
  ...ActionComponentProps,
  ...Props,
|};

const BatchDeleteRemoveActionImpl = ({
  entity,
  item,
  onDone,
  hasContainer,
  hasShipment,
}: ImplProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [deleteBatch, { loading, called }] = useMutation(deleteBatchActionMutation);
  const [
    removeBatchFromShipment,
    { loading: loadingRemoveFromShipment, called: calledRemoveFromShipment },
  ] = useMutation(removeBatchFromShipmentActionMutation);
  const [
    removeBatchFromContainer,
    { loading: loadingRemoveFromContainer, called: calledRemoveFromContainer },
  ] = useMutation(removeBatchFromContainerActionMutation);

  const onDelete = () => {
    executeActionMutation(
      deleteBatch,
      {
        id: entity.id,
      },
      close
    );
  };

  const onRemoveFromShipment = () => {
    executeActionMutation(
      removeBatchFromShipment,
      {
        id: entity.id,
      },
      close
    );
  };

  const onRemoveFromContainer = () => {
    executeActionMutation(
      removeBatchFromContainer,
      {
        id: entity.id,
      },
      close
    );
  };

  let dialogMessage = null;

  if (loading || called) {
    dialogMessage = (
      <FormattedMessage {...messages.batchDeleting} values={{ icon: <BatchLabelIcon /> }} />
    );
  } else if (
    loadingRemoveFromContainer ||
    loadingRemoveFromShipment ||
    calledRemoveFromContainer ||
    calledRemoveFromShipment
  ) {
    dialogMessage = (
      <FormattedMessage {...messages.batchRemoving} values={{ icon: <BatchLabelIcon /> }} />
    );
  } else {
    dialogMessage = (
      <FormattedMessage {...messages.confirmBatchDelete} values={{ icon: <BatchLabelIcon /> }} />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={
        loading ||
        loadingRemoveFromContainer ||
        loadingRemoveFromShipment ||
        called ||
        calledRemoveFromContainer ||
        calledRemoveFromShipment
      }
      onCancel={close}
      title={<FormattedMessage {...messages.batchRemoveDeleteTitle} />}
      dialogMessage={dialogMessage}
      buttons={
        <>
          <BaseButton
            label={<FormattedMessage {...messages.batchDeleteButton} />}
            icon="REMOVE"
            onClick={onDelete}
            backgroundColor="RED"
            hoverBackgroundColor="RED_DARK"
          />
          <BaseButton
            label={
              <FormattedMessage
                {...messages.batchRemoveButton}
                values={{ icon: <Icon icon="CONTAINER" /> }}
              />
            }
            icon="CLEAR"
            disabled={!hasContainer(entity.id, item)}
            onClick={onRemoveFromContainer}
            textColor="RED"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="RED"
          />
          <BaseButton
            label={
              <FormattedMessage
                {...messages.batchRemoveButton}
                values={{ icon: <Icon icon="SHIPMENT" /> }}
              />
            }
            icon="CLEAR"
            disabled={!hasShipment(entity.id, item)}
            onClick={onRemoveFromShipment}
            textColor="RED"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="RED"
          />
        </>
      }
    />
  );
};

const BatchDeleteRemoveAction = ({ hasShipment, hasContainer }: Props) => (
  props: ActionComponentProps
) => (
  <BatchDeleteRemoveActionImpl {...props} hasShipment={hasShipment} hasContainer={hasContainer} />
);

export default BatchDeleteRemoveAction;
