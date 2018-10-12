// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { TabItemStyle, DisabledStyle, IconStyle } from './style';

type Props = {
  icon?: string,
  label: string | React.Node,
  disabled?: boolean,
  active: boolean,
  onClick: number => void,
};

const defaultProps = {
  disabled: false,
  icon: null,
};

const TabItem = ({ icon = '', label, disabled, active, onClick }: Props) => (
  <button
    type="button"
    onClick={onClick}
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
