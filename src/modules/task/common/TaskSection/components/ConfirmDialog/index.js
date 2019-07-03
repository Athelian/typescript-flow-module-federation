// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { BaseButton, CancelButton } from 'components/Buttons';
import Dialog from 'components/Dialog';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';

type Props = {
  isOpen: boolean,
  onRequestClose: () => void,
  onCancel: () => void,
  onAddNone: () => void,
  onAddAllTasks: () => void,
  message: React.Node,
};

function ConfirmDialog({
  isOpen,
  onRequestClose,
  onCancel,
  onAddAllTasks,
  onAddNone,
  message,
}: Props) {
  return (
    <Dialog isOpen={isOpen} onRequestClose={onRequestClose} width="400px">
      <div className={DialogStyle}>
        <div className={ConfirmMessageStyle}>{message}</div>
        <div className={ButtonsStyle}>
          <CancelButton
            onClick={onCancel}
            label={<FormattedMessage id="modules.task.cancel" defaultMessage="CANCEL" />}
          />
          <BaseButton
            onClick={onAddNone}
            label={<FormattedMessage id="modules.task.addNone" defaultMessage="ADD NONE" />}
          />
          <BaseButton
            onClick={onAddAllTasks}
            label={
              <FormattedMessage id="modules.task.addAllTasks" defaultMessage="ADD ALL TASKS" />
            }
          />
        </div>
      </div>
    </Dialog>
  );
}

export default ConfirmDialog;
