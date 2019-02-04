// @flow
import * as React from 'react';
import { ActionOverlayWrapperStyle, ActionStyle } from './style';

type OptionalProps = {
  onClick: Function,
  message: React.Node,
  disabled: boolean,
};

type Props = OptionalProps;

const defaultProps = {
  onClick: () => {},
  message: '',
  disabled: false,
};

const Action = ({ onClick, message, disabled }: Props) => (
  <div className={ActionOverlayWrapperStyle} role="presentation" onClick={onClick}>
    <div className={ActionStyle(disabled)}>{message}</div>
  </div>
);

Action.defaultProps = defaultProps;

export default Action;
