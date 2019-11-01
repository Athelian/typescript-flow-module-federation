// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import Button from '../Button';
import { ButtonStyle } from './style';

type OptionalProps = {
  className?: string,
  disabled?: boolean,
  isLoading?: boolean,
  textColor?: string,
  hoverTextColor?: string,
  backgroundColor?: string,
  hoverBackgroundColor?: string,
  onClick?: (SyntheticEvent<HTMLButtonElement>) => void,
};

type Props = OptionalProps & {
  icon: string,
};

const defaultProps = {
  textColor: 'WHITE',
  hoverTextColor: 'WHITE',
  backgroundColor: 'TEAL',
  hoverBackgroundColor: 'TEAL_DARK',
};

const IconButton = React.forwardRef<Props, HTMLButtonElement>((props: Props, ref) => {
  const {
    className,
    icon,
    disabled,
    isLoading,
    textColor,
    hoverTextColor,
    backgroundColor,
    hoverBackgroundColor,
    onClick,
    ...rest
  } = { ...defaultProps, ...props };

  return (
    <Button
      ref={ref}
      disabled={disabled || isLoading}
      className={cx(ButtonStyle, className)}
      onClick={onClick}
      textColor={textColor}
      hoverTextColor={hoverTextColor}
      backgroundColor={backgroundColor}
      hoverBackgroundColor={hoverBackgroundColor}
      {...rest}
    >
      {isLoading ? <LoadingIcon size={10} /> : <Icon icon={icon} />}
    </Button>
  );
});

export default IconButton;
