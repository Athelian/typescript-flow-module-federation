// @flow
import * as React from 'react';
import Dialog from 'components/Dialog';
import { CancelButton, ActivateButton } from 'components/Buttons';
import type { ConfirmDialogProps } from 'components/Dialog/type';
import { ModalStyle, ConfirmMessageStyle, ButtonsStyle } from './style';

function ActivateDialog({
  isOpen,
  onRequestClose,
  onCancel,
  onConfirm,
  message,
}: ConfirmDialogProps) {
  return (
    <Dialog isOpen={isOpen} onRequestClose={onRequestClose} width="400px">
      <div className={ModalStyle}>
        <div className={ConfirmMessageStyle}>{message}</div>

        <div className={ButtonsStyle}>
          <CancelButton onClick={onCancel} />
          <ActivateButton onClick={onConfirm} />
        </div>
      </div>
    </Dialog>
  );
}

export default ActivateDialog;
