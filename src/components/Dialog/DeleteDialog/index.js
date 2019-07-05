// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { DeleteDialogProps } from 'components/Dialog/type';
import Dialog from '../index';
import messages from './messages';
import { DialogStyle, RemoveMessageStyle, ButtonsStyle } from './style';

function DeleteDialog({
  isOpen,
  onRequestClose,
  onCancel,
  onRemove,
  onRemoveAll,
  message,
}: DeleteDialogProps) {
  return (
    <Dialog isOpen={isOpen} onRequestClose={onRequestClose} width="400px">
      <div className={DialogStyle}>
        <div className={RemoveMessageStyle}>{message}</div>
        <div className={ButtonsStyle}>
          <button onClick={onRemove} type="button">
            <FormattedMessage {...messages.delete} />
          </button>
          <button onClick={onRemoveAll} type="button">
            <FormattedMessage {...messages.deleteAll} />
          </button>
          <button onClick={onCancel} type="button">
            <FormattedMessage {...messages.cancel} />
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default DeleteDialog;
