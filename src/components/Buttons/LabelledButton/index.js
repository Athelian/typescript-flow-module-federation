// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import Button from '../Button';
import { ButtonLoadingStyle, ButtonIconStyle, ButtonStyle } from './style';

type OptionalProps = {
  className?: string,
  icon?: string,
  disabled?: boolean,
  isLoading?: boolean,
  textColor?: string,
  hoverTextColor?: string,
  backgroundColor?: string,
  hoverBackgroundColor?: string,
  onClick?: Function,
  // @deprecated
  buttonRef?: any,
};

type Props = OptionalProps & {
  label: React.Node,
};

const defaultProps = {
  textColor: 'WHITE',
  hoverTextColor: 'WHITE',
  backgroundColor: 'TEAL',
  hoverBackgroundColor: 'TEAL_DARK',
};

const LabelledButton = React.forwardRef<Props, HTMLButtonElement>((props: Props, ref) => {
  const {
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
  } = { ...defaultProps, ...props };

  return (
    <Button
      ref={buttonRef || ref}
      disabled={disabled || isLoading}
      className={cx(ButtonStyle, className)}
      onClick={onClick}
      textColor={textColor}
      hoverTextColor={hoverTextColor}
      backgroundColor={backgroundColor}
      hoverBackgroundColor={hoverBackgroundColor}
      {...rest}
    >
      <span>{label}</span>
      {isLoading && (
        <div className={ButtonLoadingStyle}>
          <LoadingIcon size={10} />
        </div>
      )}
      {icon && !isLoading && (
        <div className={ButtonIconStyle}>
          <Icon icon={icon} />
        </div>
      )}
    </Button>
  );
});

export default LabelledButton;
