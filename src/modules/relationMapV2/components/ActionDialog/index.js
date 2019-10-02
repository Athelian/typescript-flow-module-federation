// @flow
import * as React from 'react';
import { CancelButton } from 'components/Buttons';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { Label } from 'components/Form';
import LabelIcon from './LabelIcon';
import {
  ActionDialogWrapperStyle,
  DialogMessageStyle,
  DialogSubMessageStyle,
  ButtonsWrapperStyle,
} from './style';

type Props = {|
  isOpen: boolean,
  isProcessing: boolean,
  onCancel: Function,
  title: React.Node,
  dialogMessage: React.Node,
  dialogSubMessage: React.Node,
  buttons: React.Node,
|};

export default function ActionDialog({
  isOpen,
  isProcessing,
  onCancel,
  title,
  dialogMessage,
  dialogSubMessage,
  buttons,
}: Props) {
  return (
    <Dialog
      isOpen={isOpen}
      onRequestClose={isProcessing ? () => {} : onCancel}
      showCancelButton={!isProcessing}
      onCancel={onCancel}
      width="400px"
    >
      <div className={ActionDialogWrapperStyle}>
        <Label height="30px" align="center">
          {title}
        </Label>

        {dialogMessage && <div className={DialogMessageStyle}>{dialogMessage}</div>}

        {dialogSubMessage && <div className={DialogSubMessageStyle}>{dialogSubMessage}</div>}

        {isProcessing ? (
          <LoadingIcon />
        ) : (
          <div className={ButtonsWrapperStyle}>
            <CancelButton onClick={onCancel} />
            {buttons}
          </div>
        )}
      </div>
    </Dialog>
  );
}

export { LabelIcon };
