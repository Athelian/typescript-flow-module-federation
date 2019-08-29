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
    <div
      className={ActionButtonWrapperStyle(isDisabled)}
      onClick={isDisabled ? () => {} : onClick}
      role="presentation"
    >
      {children}
    </div>
  );
}

ActionButton.defaultProps = defaultProps;

export default ActionButton;
