// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { cx } from 'react-emotion';
import { TabItemStyle, DisabledStyle, IconStyle } from './style';

type OptionalProps = {
  className: string,
  disabled?: boolean,
  icon?: string,
};
type Props = OptionalProps & {
  label: string | React.Node,
  disabled?: boolean,
  active: boolean,
  onClick: Function,
};

const defaultProps = {
  className: '',
  disabled: false,
  icon: null,
};

const TabItem = ({ icon = '', label, disabled, active, onClick, className }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className={disabled ? DisabledStyle : cx(TabItemStyle(active), className)}
  >
    {icon && (
      <div className={IconStyle}>
        <Icon icon={icon} />
      </div>
    )}
    {label}
    <span />
  </button>
);

TabItem.defaultProps = defaultProps;

export default TabItem;
