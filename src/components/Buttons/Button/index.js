// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import { ButtonStyle } from './style';

type OptionalProps = {
  className?: string,
  disabled?: boolean,
  onClick?: (SyntheticEvent<HTMLButtonElement>) => void,
};

type Props = OptionalProps & {
  textColor: string,
  hoverTextColor: string,
  backgroundColor: string,
  hoverBackgroundColor: string,
  children: React.Node,
  borderRadius?: string,
};

const Button = React.forwardRef<Props, HTMLButtonElement>(
  (
    {
      textColor,
      hoverTextColor,
      backgroundColor,
      hoverBackgroundColor,
      className,
      disabled,
      onClick,
      children,
      borderRadius,
      ...rest
    }: Props,
    ref
  ) => (
    <button
      ref={ref}
      type="button"
      className={cx(
        ButtonStyle({
          textColor,
          hoverTextColor,
          backgroundColor,
          hoverBackgroundColor,
          borderRadius,
        }),
        className
      )}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  )
);

export default Button;
