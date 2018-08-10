// @flow
import * as React from 'react';
import { WrapperStyle } from './style';

type Props = {
  onClick: Function,
  badge?: number,
};

const defaultProps = {
  badge: 0,
};

const LogsButton = ({ onClick, badge }: Props) => (
  <button type="button" onClick={onClick} className={WrapperStyle}>
    LOGS {!!badge && badge > 0 && `(${badge})`}
  </button>
);

LogsButton.defaultProps = defaultProps;

export default LogsButton;
