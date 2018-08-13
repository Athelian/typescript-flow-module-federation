// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Dialog from '../index';
import messages from './messages';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';

type Props = {
  isOpen: boolean,
  onRequestClose: () => void,
  onCancel: () => void,
  onConfirm: () => void,
  message: string,
  // dialog width
  width: number,
};

function ConfirmDialog({ isOpen, onRequestClose, onCancel, onConfirm, message, width }: Props) {
  return (
    <Dialog isOpen={isOpen} onRequestClose={onRequestClose} options={{ width }}>
      <div className={DialogStyle}>
        <div className={ConfirmMessageStyle}>{message}</div>
        <div className={ButtonsStyle}>
          <button onClick={onCancel} type="button">
            <FormattedMessage {...messages.cancel} />
          </button>
          <button onClick={onConfirm} type="button">
            <FormattedMessage {...messages.confirm} />
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default ConfirmDialog;
