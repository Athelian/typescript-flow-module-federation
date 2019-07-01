// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { CompleteDialogProps } from 'components/Dialog/type';
import Dialog from '../index';
import messages from './messages';
import { DialogStyle, UnCompleteMessageStyle, ButtonsStyle } from './style';

function CompleteDialog({
  isOpen,
  onRequestClose,
  onCancel,
  onSkip,
  onComplete,
  onUnChange,
  message,
  editable,
}: CompleteDialogProps & {
  editable: {
    skip: boolean,
    complete: boolean,
  },
}) {
  return (
    <Dialog isOpen={isOpen} onRequestClose={onRequestClose} width="400px">
      <div className={DialogStyle}>
        <div className={UnCompleteMessageStyle}>{message}</div>
        <div className={ButtonsStyle}>
          {editable.skip && (
            <button onClick={onSkip} type="button">
              <FormattedMessage {...messages.skip} />
            </button>
          )}
          {editable.complete && (
            <button onClick={onComplete} type="button">
              <FormattedMessage {...messages.complete} />
            </button>
          )}
          <button onClick={onUnChange} type="button">
            <FormattedMessage {...messages.unChange} />
          </button>
          <button onClick={onCancel} type="button">
            <FormattedMessage {...messages.cancel} />
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default CompleteDialog;
