// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, { BatchLabelIcon } from 'components/Dialog/ActionDialog';
import messages from '../messages';
import batchCreateActionMutation from './mutation';

type Props = {
  ...ActionComponentProps,
  getOrderItemBatchesCount: (orderItemId: string, item: Object) => number,
};

const BatchCreateActionImpl = ({ entity, item, onDone, getOrderItemBatchesCount }: Props) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [mutate, { called }] = useMutation(batchCreateActionMutation);

  React.useEffect(() => {
    if (called) {
      return;
    }

    const timeBeforeMutation = Date.now();

    mutate({
      variables: {
        input: {
          orderItemId: entity.id,
          no: `batch no ${getOrderItemBatchesCount(entity.id, item) + 1}`,
          quantity: 0,
        },
      },
    }).then(() => {
      // TODO: Check and handle not successful mutation
      const delayToClose = 2000 - (Date.now() - timeBeforeMutation);

      setTimeout(() => close(), Math.max(delayToClose, 0));
    });
  }, [mutate, entity, getOrderItemBatchesCount, item, called, close]);

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing
      onCancel={() => {}}
      title={<FormattedMessage {...messages.batchCreateTitle} />}
      dialogMessage={
        <FormattedMessage
          {...messages.batchCreateCreating}
          values={{ batchLabel: <BatchLabelIcon /> }}
        />
      }
      buttons={null}
    />
  );
};

const BatchCreateAction = (
  getOrderItemBatchesCount: (orderItemId: string, item: Object) => number
) => (props: ActionComponentProps) => (
  <BatchCreateActionImpl {...props} getOrderItemBatchesCount={getOrderItemBatchesCount} />
);

export default BatchCreateAction;
