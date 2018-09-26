// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import {
  ButtonWrapperStyle,
  DisabledButtonWrapperStyle,
  ButtonLabelStyle,
  ButtonIconStyle,
} from './style';

type OptionalProps = {
  icon?: string,
  label: React.Node,
  disabled: boolean,
  textColor: string,
  hoverTextColor: string,
  backgroundColor: string,
  hoverBackgroundColor: string,
  onClick: Function,
};

type Props = OptionalProps;

const defaultProps = {
  disabled: false,
  textColor: 'WHITE',
  hoverTextColor: 'WHITE',
  backgroundColor: 'TEAL',
  hoverBackgroundColor: 'TEAL_DARK',
  onClick: () => {},
};

const BaseButton = ({
  icon,
  label,
  disabled,
  textColor,
  hoverTextColor,
  backgroundColor,
  hoverBackgroundColor,
  onClick,
  ...rest
}: Props): React.Node => (
  <button
    type="button"
    className={
      disabled
        ? DisabledButtonWrapperStyle
        : ButtonWrapperStyle({ textColor, hoverTextColor, backgroundColor, hoverBackgroundColor })
    }
    disabled={disabled}
    onClick={onClick}
    {...rest}
  >
    <div className={ButtonLabelStyle}>{label}</div>
    {icon && (
      <div className={ButtonIconStyle}>
        <Icon icon={icon} />
      </div>
    )}
  </button>
);

BaseButton.defaultProps = defaultProps;

export default BaseButton;
