// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { RemoveDialogProps } from 'components/Dialog/type';

import Dialog from '../index';
import messages from './messages';
import { DialogStyle, RemoveMessageStyle, ButtonsStyle } from './style';

function RemoveDialog({
  isOpen,
  onRequestClose,
  onCancel,
  onRemove,
  message,
  width,
}: RemoveDialogProps) {
  return (
    <Dialog isOpen={isOpen} onRequestClose={onRequestClose} options={{ width }}>
      <div className={DialogStyle}>
        <div className={RemoveMessageStyle}>{message}</div>
        <div className={ButtonsStyle}>
          <button onClick={onCancel} type="button">
            <FormattedMessage {...messages.cancel} />
          </button>
          <button onClick={onRemove} type="button">
            <FormattedMessage {...messages.remove} />
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default RemoveDialog;
