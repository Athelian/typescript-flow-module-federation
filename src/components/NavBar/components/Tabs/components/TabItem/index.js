// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { TabItemStyle, DisabledStyle, IconStyle } from './style';

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
  <button
    type="button"
    onClick={onActive}
    className={disabled ? DisabledStyle : TabItemStyle(active)}
  >
    <div className={IconStyle}>
      <Icon icon={icon} />
    </div>
    {label}
    <span />
  </button>
);

TabItem.defaultProps = defaultProps;

export default TabItem;
