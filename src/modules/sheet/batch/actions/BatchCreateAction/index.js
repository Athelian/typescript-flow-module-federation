// @flow
import * as React from 'react';
import { useMutation } from '@apollo/react-hooks';
import LoadingIcon from 'components/LoadingIcon';
import Dialog from 'components/Dialog';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionDialog } from 'components/Sheet/SheetAction';
import batchCreateActionMutation from './mutation';
import { DialogWrapperStyle } from './style';

type Props = {
  ...ActionComponentProps,
  getOrderItemBatchesCount: (orderItemId: string, item: Object) => number,
};

const BatchCreateActionImpl = ({ entity, item, onDone, getOrderItemBatchesCount }: Props) => {
  const [open, close] = useSheetActionDialog(onDone);
  const [mutate, { loading, called }] = useMutation(batchCreateActionMutation);

  React.useEffect(() => {
    mutate({
      variables: {
        input: {
          orderItemId: entity.id,
          no: `batch no ${getOrderItemBatchesCount(entity.id, item) + 1}`,
          quantity: 0,
        },
      },
    });
  }, [mutate, entity, getOrderItemBatchesCount, item]);

  React.useEffect(() => {
    // TODO: Check and handle not successful mutation
    if (!loading && called) {
      close();
    }
  }, [loading, called, close]);

  return (
    <Dialog
      isOpen={open}
      onRequestClose={() => {
        if (!loading) {
          close();
        }
      }}
    >
      <div className={DialogWrapperStyle}>
        Creating batch...
        <LoadingIcon />
      </div>
    </Dialog>
  );
};

const BatchCreateAction = (
  getOrderItemBatchesCount: (orderItemId: string, item: Object) => number
) => (props: ActionComponentProps) => (
  <BatchCreateActionImpl {...props} getOrderItemBatchesCount={getOrderItemBatchesCount} />
);

export default BatchCreateAction;
