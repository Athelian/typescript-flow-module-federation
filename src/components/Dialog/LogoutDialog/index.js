// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { CancelButton, BaseButton } from 'components/Buttons';
import Dialog from '../index';
import messages from './messages';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';

type Props = {
  isOpen: boolean,
  onRequestClose: () => void,
  onCancel: () => void,
  onConfirm: () => Promise<any>,
};

function LogoutDialog({ isOpen, onRequestClose, onCancel, onConfirm }: Props) {
  return (
    <Dialog isOpen={isOpen} onRequestClose={onRequestClose} options={{ width: 300 }}>
      <div className={DialogStyle}>
        <div className={ConfirmMessageStyle}>
          <FormattedMessage {...messages.confirm} />
        </div>
        <div className={ButtonsStyle}>
          <CancelButton onClick={onCancel} />
          <BaseButton
            data-testid="logout-confirm-button"
            icon="LOGOUT"
            label={<FormattedMessage {...messages.logout} />}
            onClick={onConfirm}
          />
        </div>
      </div>
    </Dialog>
  );
}

export default LogoutDialog;
