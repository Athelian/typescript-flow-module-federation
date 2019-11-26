// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionAutoProcess, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, { ItemLabelIcon } from 'components/Dialog/ActionDialog';
import messages from '../messages';
import cloneOrderItemActionMutation from './mutation';

const OrderItemCloneAction = ({ entity, onDone }: ActionComponentProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  useSheetActionAutoProcess(
    cloneOrderItemActionMutation,
    {
      id: entity.id,
      input: {},
    },
    close
  );

  return (
    <ActionDialog
      isOpen={isOpen}
      isProcessing
      title={<FormattedMessage {...messages.orderItemCloneTitle} />}
      dialogMessage={
        <FormattedMessage
          {...messages.orderItemCloneCloning}
          values={{ icon: <ItemLabelIcon /> }}
        />
      }
    />
  );
};

export default OrderItemCloneAction;
