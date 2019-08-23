// @flow
import * as React from 'react';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { CancelButton, MoveButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';

type Props = {|
  isOpen: boolean,
  onConfirm: () => Promise<void>,
  onCancel: () => void,
  from: {
    icon: string,
    value: string,
  },
  to: {
    icon: string,
    value: string,
  },
  isProcessing?: boolean,
|};

export default function MoveEntityConfirm({
  isOpen,
  isProcessing,
  onCancel,
  onConfirm,
  from,
  to,
}: Props) {
  return (
    <Dialog isOpen={isOpen} width="400px" onRequestClose={() => {}}>
      <div className={DialogStyle}>
        <h3 className={ConfirmMessageStyle}>
          Are you sure you want to move <Icon icon={from.icon} /> {` ${from.value} to `}{' '}
          <Icon icon={to.icon} /> {` ${to.value}?`}
        </h3>
        {isProcessing && <LoadingIcon />}
        <div className={ButtonsStyle}>
          <CancelButton disabled={Boolean(isProcessing)} onClick={onCancel} />
          <MoveButton disabled={Boolean(isProcessing)} onClick={onConfirm} />
        </div>
      </div>
    </Dialog>
  );
}
