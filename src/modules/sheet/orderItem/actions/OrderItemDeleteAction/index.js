// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { BaseButton } from 'components/Buttons';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { executeActionMutation, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, { BatchesLabelIcon, ItemLabelIcon } from 'components/Dialog/ActionDialog';
import DocumentsDeleteDialog from 'components/Dialog/DocumentsDeleteDialog';
import { deleteManyFileMutation } from 'modules/document/mutation';
import messages from '../messages';
import deleteOrderItemActionMutation from './mutation';

type Props = {|
  getOrderItemFiles: (orderItemId: string, item: Object) => Array<Object>,
|};

type ImplProps = {|
  ...ActionComponentProps,
  ...Props,
|};

const OrderItemDeleteActionImpl = ({ entity, item, onDone, getOrderItemFiles }: ImplProps) => {
  const [step, setStep] = React.useState(1);
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [deleteOrderItem, { loading: deleteLoading, called: deleteCalled }] = useMutation(
    deleteOrderItemActionMutation
  );
  const [deleteFiles, { loading: deleteFilesLoading, called: deleteFilesCalled }] = useMutation(
    deleteManyFileMutation
  );
  const files = React.useMemo(() => getOrderItemFiles(entity.id, item), [
    getOrderItemFiles,
    entity.id,
    item,
  ]);

  const onDeleteConfirm = () => {
    if (files.length > 0) {
      setStep(2);
    } else {
      executeActionMutation(
        deleteOrderItem,
        {
          id: entity.id,
        },
        close
      );
    }
  };

  const onDelete = () => {
    executeActionMutation(
      deleteOrderItem,
      {
        id: entity.id,
      },
      () => {
        executeActionMutation(
          deleteFiles,
          {
            ids: files.map(file => file.id),
          },
          close
        );
      }
    );
  };
  const onKeep = () => {
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

  if (deleteLoading || deleteCalled) {
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

  if (step === 2) {
    return (
      <DocumentsDeleteDialog
        entityType="ITEM"
        isProcessing={deleteLoading || deleteCalled || deleteFilesLoading || deleteFilesCalled}
        files={files}
        isOpen={isOpen}
        onCancel={close}
        onKeep={onKeep}
        onDelete={onDelete}
      />
    );
  }

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing={deleteLoading || deleteCalled}
      onCancel={close}
      title={<FormattedMessage {...messages.orderItemDeleteTitle} />}
      dialogMessage={dialogMessage}
      dialogSubMessage={dialogSubMessage}
      buttons={
        <BaseButton
          label={<FormattedMessage {...messages.orderItemDeleteButton} />}
          icon="REMOVE"
          onClick={onDeleteConfirm}
          backgroundColor="RED"
          hoverBackgroundColor="RED_DARK"
        />
      }
    />
  );
};

const OrderItemDeleteAction = ({ getOrderItemFiles }: Props) => (props: ActionComponentProps) => (
  <OrderItemDeleteActionImpl {...props} getOrderItemFiles={getOrderItemFiles} />
);

export default OrderItemDeleteAction;
