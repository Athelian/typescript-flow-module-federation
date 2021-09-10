// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import Button from '../Button';
import { ButtonLoadingStyle, ButtonIconStyle, ButtonStyle } from './style';

type Props = {|
  className?: string,
  icon?: string,
  disabled?: boolean,
  isLoading?: boolean,
  textColor?: string,
  hoverTextColor?: string,
  backgroundColor?: string,
  hoverBackgroundColor?: string,
  onClick?: Function,
  borderRadius?: string,
  // @deprecated
  buttonRef?: any,
  label: React.Node,
  suffix?: React$Node,
  id?: string,
  type?: string,
  'data-testid'?: string,
|};

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
    suffix,
    borderRadius,
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
      borderRadius={borderRadius}
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
      {suffix && <span>{suffix}</span>}
    </Button>
  );
});

export default LabelledButton;
