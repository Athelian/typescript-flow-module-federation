// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { cx } from 'react-emotion';
import { TabItemStyle, DisabledStyle, IconStyle } from './style';

type OptionalProps = {
  className: string,
  disabled?: boolean,
  icon?: string,
  allowClickOnDisable: boolean,
};
type Props = OptionalProps & {
  label: string | React.Node,
  active: boolean,
  onClick: Function,
};

const defaultProps = {
  className: '',
  disabled: false,
  allowClickOnDisable: false,
  icon: null,
};

const TabItem = ({
  icon = '',
  allowClickOnDisable,
  label,
  disabled,
  active,
  onClick,
  className,
}: Props) => (
  <button
    type="button"
    {...(allowClickOnDisable ? {} : { disabled })}
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
