// @flow
import * as React from 'react';
import { TabItemStyle, DisabledStyle } from './style';

type Props = {
  label: string | React.Node,
  disabled?: boolean,
  active: boolean,
  onActive: number => void,
};

const defaultProps = {
  disabled: false,
};

const TabItem = ({ label, disabled, active, onActive }: Props) => (
  <button onClick={onActive} className={disabled ? DisabledStyle : TabItemStyle(active)}>
    {label}
  </button>
);

TabItem.defaultProps = defaultProps;

export default TabItem;
