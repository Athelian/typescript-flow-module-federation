// @flow
import * as React from 'react';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import {
  ButtonWrapperStyle,
  DisabledButtonWrapperStyle,
  ButtonLabelStyle,
  ButtonLoadingWrapperStyle,
  ButtonIconStyle,
} from './style';

type OptionalProps = {
  icon?: string,
  label: React.Node,
  disabled: boolean,
  isLoading: boolean,
  textColor: string,
  hoverTextColor: string,
  backgroundColor: string,
  hoverBackgroundColor: string,
  onClick: Function,
};

type Props = OptionalProps;

const defaultProps = {
  disabled: false,
  isLoading: false,
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
  isLoading,
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
      disabled || isLoading
        ? DisabledButtonWrapperStyle
        : ButtonWrapperStyle({ textColor, hoverTextColor, backgroundColor, hoverBackgroundColor })
    }
    disabled={disabled || isLoading}
    onClick={onClick}
    {...rest}
  >
    <div className={ButtonLabelStyle}>{label}</div>
    {isLoading && (
      <div className={ButtonLoadingWrapperStyle}>
        <LoadingIcon size={10} />
      </div>
    )}
    {icon &&
      !isLoading && (
        <div className={ButtonIconStyle}>
          <Icon icon={icon} />
        </div>
      )}
  </button>
);

BaseButton.defaultProps = defaultProps;

export default BaseButton;
