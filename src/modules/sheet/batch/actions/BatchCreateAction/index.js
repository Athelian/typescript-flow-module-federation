// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import { colors } from 'styles/common';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import Dialog from 'components/Dialog';
import { Label } from 'components/Form';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionDialog } from 'components/Sheet/SheetAction';
import messages from '../messages';
import batchCreateActionMutation from './mutation';
import { DialogWrapperStyle, DialogMessageStyle } from './style';

type Props = {
  ...ActionComponentProps,
  getOrderItemBatchesCount: (orderItemId: string, item: Object) => number,
};

const BatchCreateActionImpl = ({ entity, item, onDone, getOrderItemBatchesCount }: Props) => {
  const [open, close] = useSheetActionDialog(onDone);
  const [mutate, { loading, called }] = useMutation(batchCreateActionMutation);

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
    <Dialog
      isOpen={open}
      onRequestClose={() => {
        if (!loading) {
          close();
        }
      }}
    >
      <div className={DialogWrapperStyle}>
        <Label height="30px" align="center">
          <FormattedMessage {...messages.batchCreateTitle} />
        </Label>
        <div className={DialogMessageStyle}>
          <FormattedMessage
            {...messages.batchCreateMessage}
            values={{
              icon: (
                <span style={{ color: colors.BATCH }}>
                  <Icon icon="BATCH" />
                </span>
              ),
            }}
          />
        </div>
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
