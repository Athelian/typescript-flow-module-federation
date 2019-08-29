// @flow
import * as React from 'react';
import { ActionButtonWrapperStyle } from './style';

type Props = {
  isDisabled?: boolean,
  onClick: Function,
  children: React.Node,
};

const defaultProps = {
  isDisabled: false,
};

function ActionButton({ isDisabled, onClick, children }: Props) {
  return (
    <button
      className={ActionButtonWrapperStyle(isDisabled)}
      onClick={isDisabled ? () => {} : onClick}
      type="button"
    >
      {children}
    </button>
  );
}

ActionButton.defaultProps = defaultProps;

export default ActionButton;
