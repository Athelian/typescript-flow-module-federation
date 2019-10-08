// @flow
import * as React from 'react';

import { Entities, FocusedView } from 'modules/relationMapV2/store';
import Dialog from 'components/Dialog';
import LoadingIcon from 'components/LoadingIcon';
import { CancelButton, MoveButton } from 'components/Buttons';
import Icon from 'components/Icon';
import { DialogStyle, ConfirmMessageStyle, ButtonsStyle } from './style';
import { moveEntityMutation } from './mutation';

type Props = {
  onSuccess: ({ orderIds: Array<string> }) => void,
};

export default function MoveEntityConfirm({ onSuccess }: Props) {
  const { dispatch, state } = FocusedView.useContainer();
  const { mapping } = Entities.useContainer();
  const {
    isProcessing,
    isOpen,
    detail: { from, to },
  } = state.moveEntity;
  const onCancel = () => {
    dispatch({
      type: 'CANCEL_MOVE',
      payload: {},
    });
  };
  const onConfirm = () => {
    dispatch({
      type: 'CONFIRM_MOVE_START',
      payload: {},
    });
    moveEntityMutation(state, mapping.entities)
      .then(onSuccess)
      .catch(() => {
        dispatch({
          type: 'CONFIRM_MOVE_END',
          payload: {},
        });
      });
  };
  return (
    <Dialog isOpen={isOpen} width="400px" onRequestClose={() => {}}>
      {isOpen && (
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
      )}
    </Dialog>
  );
}
