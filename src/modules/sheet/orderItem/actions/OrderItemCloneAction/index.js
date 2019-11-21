// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation } from '@apollo/react-hooks';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, { ItemLabelIcon } from 'components/Dialog/ActionDialog';
import messages from '../messages';
import cloneOrderItemActionMutation from './mutation';

const OrderItemCloneAction = ({ entity, item, onDone }: ActionComponentProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  const [mutate, { called }] = useMutation(cloneOrderItemActionMutation);

  React.useEffect(() => {
    if (called) {
      return;
    }

    const timeBeforeMutation = Date.now();

    mutate({
      variables: {
        id: entity.id,
        input: {},
      },
    }).then(() => {
      // TODO: Check and handle not successful mutation
      const delayToClose = 2000 - (Date.now() - timeBeforeMutation);

      setTimeout(() => close(), Math.max(delayToClose, 0));
    });
  }, [mutate, entity, item, called, close]);

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing
      onCancel={() => {}}
      title={<FormattedMessage {...messages.orderItemCloneTitle} />}
      dialogMessage={
        <FormattedMessage
          {...messages.orderItemCloneCloning}
          values={{ itemLabel: <ItemLabelIcon /> }}
        />
      }
      buttons={null}
    />
  );
};

export default OrderItemCloneAction;
