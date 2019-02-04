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
  <div className={ActionOverlayWrapperStyle}>
    <div className={ActionStyle(disabled)} role="presentation" onClick={onClick}>
      {message}
    </div>
  </div>
);

Action.defaultProps = defaultProps;

export default Action;
