// @flow
import * as React from 'react';
import { type OptionalProps, defaultProps } from './type';
import { StandardStyleWrapperStyle } from './style';

type Props = OptionalProps & {
  children: React.Node,
};

const StandardStyle = ({
  type,
  isFocused,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  height,
  children,
}: Props) => (
  <div
    className={StandardStyleWrapperStyle({
      type,
      isFocused,
      hasError,
      disabled,
      forceHoverStyle,
      width,
      height,
    })}
  >
    {children}
  </div>
);

StandardStyle.defaultProps = defaultProps;

export default StandardStyle;
