// @flow
import * as React from 'react';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import { cx } from 'react-emotion';
import {
  ButtonWrapperStyle,
  DisabledButtonWrapperStyle,
  ButtonLabelStyle,
  ButtonLoadingWrapperStyle,
  ButtonIconStyle,
} from './style';

type OptionalProps = {
  className: string,
  icon?: string,
  label: React.Node,
  disabled: boolean,
  isLoading: boolean,
  textColor: string,
  hoverTextColor: string,
  backgroundColor: string,
  hoverBackgroundColor: string,
  onClick: Function,
  buttonRef?: any,
};

type Props = OptionalProps;

const defaultProps = {
  className: '',
  disabled: false,
  isLoading: false,
  textColor: 'WHITE',
  hoverTextColor: 'WHITE',
  backgroundColor: 'TEAL',
  hoverBackgroundColor: 'TEAL_DARK',
  onClick: () => {},
};

const BaseButton = ({
  className,
  icon,
  label,
  disabled,
  isLoading,
  textColor,
  hoverTextColor,
  backgroundColor,
  hoverBackgroundColor,
  onClick,
  buttonRef,
  ...rest
}: Props): React.Node => (
  <button
    type="button"
    className={
      disabled || isLoading
        ? DisabledButtonWrapperStyle
        : cx(
            ButtonWrapperStyle({
              textColor,
              hoverTextColor,
              backgroundColor,
              hoverBackgroundColor,
            }),
            className
          )
    }
    disabled={disabled || isLoading}
    onClick={event => {
      event.stopPropagation();
      onClick();
    }}
    ref={buttonRef}
    {...rest}
  >
    <div className={ButtonLabelStyle}>{label}</div>
    {isLoading && (
      <div className={ButtonLoadingWrapperStyle}>
        <LoadingIcon size={10} />
      </div>
    )}
    {icon && !isLoading && (
      <div className={ButtonIconStyle}>
        <Icon icon={icon} />
      </div>
    )}
  </button>
);

BaseButton.defaultProps = defaultProps;

export default BaseButton;
