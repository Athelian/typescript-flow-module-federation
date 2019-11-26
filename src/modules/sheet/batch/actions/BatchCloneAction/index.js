// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { ActionComponentProps } from 'components/Sheet/SheetAction/types';
import { useSheetActionAutoProcess, useSheetActionDialog } from 'components/Sheet/SheetAction';
import ActionDialog, { BatchLabelIcon } from 'components/Dialog/ActionDialog';
import messages from '../messages';
import cloneBatchActionMutation from './mutation';

const BatchCloneAction = ({ entity, onDone }: ActionComponentProps) => {
  const [isOpen, close] = useSheetActionDialog(onDone);
  useSheetActionAutoProcess(
    cloneBatchActionMutation,
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
      title={<FormattedMessage {...messages.batchCloneTitle} />}
      dialogMessage={
        <FormattedMessage {...messages.batchCloneCloning} values={{ icon: <BatchLabelIcon /> }} />
      }
    />
  );
};

export default BatchCloneAction;
