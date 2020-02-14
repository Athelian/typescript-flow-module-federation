// @flow
import * as React from 'react';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import { cx } from 'react-emotion';
import { TabItemStyle, DisabledStyle, IconStyle, LabelStyle } from './style';

type Props = {|
  label: React$Node,
  active: boolean,
  icon?: string,
  className?: string,
  allowClickOnDisable?: boolean,
  disabled?: boolean,
  showTooltip?: boolean,
  tooltipMessage?: React$Node,
  onClick?: Function,
|};

const TabItem = ({
  icon = '',
  allowClickOnDisable = false,
  disabled = false,
  showTooltip = false,
  tooltipMessage = '',
  label,
  active,
  onClick,
  className,
}: Props) => {
  return showTooltip ? (
    <Tooltip message={tooltipMessage}>
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
        {label && <div className={LabelStyle}>{label}</div>}
        <span />
      </button>
    </Tooltip>
  ) : (
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
      {label && <div className={LabelStyle}>{label}</div>}
      <span />
    </button>
  );
};

export default TabItem;
