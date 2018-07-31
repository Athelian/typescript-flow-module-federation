// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { TabItemStyle, DisabledStyle } from './style';

type Props = {
  icon?: string,
  label: string | React.Node,
  disabled?: boolean,
  active: boolean,
  onActive: number => void,
};

const defaultProps = {
  disabled: false,
  icon: null,
};

const TabItem = ({ icon = '', label, disabled, active, onActive }: Props) => (
  <button onClick={onActive} className={disabled ? DisabledStyle : TabItemStyle(active)}>
    <span>
      <Icon icon={icon} />
    </span>
    {label}
  </button>
);

TabItem.defaultProps = defaultProps;

export default TabItem;
