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
  const [minTimer, setMinTimer] = React.useState(2);
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [mutate, { loading, called }] = useMutation(batchCreateActionMutation);

  React.useEffect(() => {
    if (!minTimer) return () => {};

    const intervalId = setInterval(() => {
      setMinTimer(minTimer - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [minTimer]);

  React.useEffect(() => {
    if (loading || called) {
      return;
    }

    mutate({
      variables: {
        input: {
          orderItemId: entity.id,
          no: `batch no ${getOrderItemBatchesCount(entity.id, item) + 1}`,
          quantity: 0,
        },
      },
    });
  }, [mutate, entity, getOrderItemBatchesCount, item, loading, called]);

  React.useEffect(() => {
    // TODO: Check and handle not successful mutation
    if (!loading && called) {
      close();
    }
  }, [loading, called, close]);

  return (
    <ActionDialog
      isOpen={isOpen || minTimer > 0}
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
