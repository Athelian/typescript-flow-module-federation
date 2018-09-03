// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Dialog from 'components/Dialog';
import Icon from 'components/Icon';

import { CancelButton, CustomButton } from 'components/NavButtons';
import type { ConfirmDialogProps } from 'components/Dialog/type';

import messages from './messages';
import { ModalStyle, ConfirmMessageStyle, ButtonsStyle } from '../ActivateDialog/style';

function ArchiveDialog({
  isOpen,
  onRequestClose,
  onCancel,
  onConfirm,
  width,
  message,
}: ConfirmDialogProps) {
  return (
    <Dialog isOpen={isOpen} onRequestClose={onRequestClose} options={{ width }}>
      <div className={ModalStyle}>
        <div className={ConfirmMessageStyle}>{message}</div>
        <div className={ButtonsStyle}>
          <CancelButton onClick={onCancel} />

          <CustomButton
            label={<FormattedMessage {...messages.archive} />}
            icon={<Icon icon="ARCHIVE" />}
            color="teal"
            onClick={onConfirm}
          />
        </div>
      </div>
    </Dialog>
  );
}

export default ArchiveDialog;
