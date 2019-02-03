// @flow
import * as React from 'react';
import { cx } from 'react-emotion';

import { OverlayStyle, CardWrapperStyle, DisabledWrapper, ActionWrapperStyle } from './style';

type Props = {
  onClick?: Function,
  message: React.Node,
  disabled?: boolean,
};

const defaultProps = {
  disabled: false,
};

const Action = ({ onClick, message, disabled }: Props) => (
  <div className={cx(OverlayStyle, CardWrapperStyle)}>
    {disabled ? (
      <div className={DisabledWrapper}>{message}</div>
    ) : (
      <div className={ActionWrapperStyle} role="presentation" onClick={onClick}>
        {message}
      </div>
    )}
  </div>
);

Action.defaultProps = defaultProps;

export default Action;
