// @flow
import * as React from 'react';
import Dialog from 'components/Dialog';
import { YesButton, NoButton } from 'components/Buttons';
import type { ConfirmDialogProps } from 'components/Dialog/type';
import {
  ModalStyle,
  ConfirmMessageStyle,
  ButtonsStyle,
} from 'components/Dialog/ActivateDialog/style';

type PriceDialogProps = ConfirmDialogProps & {
  onDeny: Function,
};
function PriceDialog({
  isOpen,
  onRequestClose,
  onCancel,
  onConfirm,
  onDeny,
  message,
}: PriceDialogProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      width="450px"
      showCancelButton
      onCancel={onCancel}
    >
      <div className={ModalStyle}>
        <div className={ConfirmMessageStyle}>{message}</div>
        <div className={ButtonsStyle}>
          <NoButton onClick={onDeny} />
          <YesButton onClick={onConfirm} />
        </div>
      </div>
    </Dialog>
  );
}

export default PriceDialog;
