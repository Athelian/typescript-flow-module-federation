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
};

function LogoutDialog({ isOpen, onRequestClose, onCancel, onConfirm }: Props) {
  return (
    <Dialog isOpen={isOpen} onRequestClose={onRequestClose} options={{ width: 300 }}>
      <div className={DialogStyle}>
        <div className={ConfirmMessageStyle}>
          <FormattedMessage {...messages.confirm} />
        </div>
        <div className={ButtonsStyle}>
          <button onClick={onCancel} type="button">
            <FormattedMessage {...messages.cancel} />
          </button>
          <button data-testid="logout-confirm-button" onClick={onConfirm} type="button">
            <FormattedMessage {...messages.logout} />
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default LogoutDialog;
