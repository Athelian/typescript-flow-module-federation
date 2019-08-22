// @flow
import * as React from 'react';
import Dialog from 'components/Dialog';
import { CancelButton, MoveButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';

type Props = {|
  isOpen: boolean,
  onConfirm: () => void,
  onCancel: () => void,
  from: {
    icon: string,
    value: string,
  },
  to: {
    icon: string,
    value: string,
  },
|};

export default function MoveEntityConfirm({ isOpen, onCancel, onConfirm, from, to }: Props) {
  return (
    <Dialog isOpen={isOpen} width="400px" onRequestClose={() => {}}>
      <div className={DialogStyle}>
        <h3 className={ConfirmMessageStyle}>
          Are you sure you want to move <Icon icon={from.icon} /> {` ${from.value} to `}{' '}
          <Icon icon={to.icon} /> {` ${to.value}?`}
        </h3>
        <div className={ButtonsStyle}>
          <CancelButton onClick={onCancel} />
          <MoveButton onClick={onConfirm} />
        </div>
      </div>
    </Dialog>
  );
}
