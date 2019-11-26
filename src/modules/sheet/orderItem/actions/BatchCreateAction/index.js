// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionAutoProcess, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, { BatchLabelIcon } from 'components/Dialog/ActionDialog';
import messages from '../messages';
import batchCreateActionMutation from './mutation';

type Props = {
  ...ActionComponentProps,
  getOrderItemBatchesCount: (orderItemId: string, item: Object) => number,
};

const BatchCreateActionImpl = ({ entity, item, onDone, getOrderItemBatchesCount }: Props) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  useSheetActionAutoProcess(
    batchCreateActionMutation,
    {
      input: {
        orderItemId: entity.id,
        no: `batch no ${getOrderItemBatchesCount(entity.id, item) + 1}`,
        quantity: 0,
      },
    },
    close
  );

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing
      title={<FormattedMessage {...messages.batchCreateTitle} />}
      dialogMessage={
        <FormattedMessage {...messages.batchCreateCreating} values={{ icon: <BatchLabelIcon /> }} />
      }
    />
  );
};

const BatchCreateAction = (
  getOrderItemBatchesCount: (orderItemId: string, item: Object) => number
) => (props: ActionComponentProps) => (
  <BatchCreateActionImpl {...props} getOrderItemBatchesCount={getOrderItemBatchesCount} />
);

export default BatchCreateAction;
