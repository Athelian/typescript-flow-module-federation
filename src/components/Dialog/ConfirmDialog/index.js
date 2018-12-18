// @flow
import * as React from 'react';
import { NoButton, YesButton } from 'components/Buttons';
import type { ConfirmDialogProps } from 'components/Dialog/type';
import Dialog from '../index';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';

function ConfirmDialog({
  isOpen,
  onRequestClose,
  onCancel,
  onConfirm,
  message,
}: ConfirmDialogProps) {
  return (
    <Dialog isOpen={isOpen} onRequestClose={onRequestClose} width="400px">
      <div className={DialogStyle}>
        <div className={ConfirmMessageStyle}>{message}</div>
        <div className={ButtonsStyle}>
          <NoButton onClick={onCancel} />
          <YesButton onClick={onConfirm} />
        </div>
      </div>
    </Dialog>
  );
}

export default ConfirmDialog;
