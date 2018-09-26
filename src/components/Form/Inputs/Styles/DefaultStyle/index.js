// @flow
import * as React from 'react';
import { type OptionalProps, defaultProps } from './type';
import { DefaultStyleWrapperStyle } from './style';

type Props = OptionalProps & {
  children: React.Node,
};

const DefaultStyle = ({
  type,
  isFocused,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  height,
  children,
}: Props): React.Node => (
  <div
    className={DefaultStyleWrapperStyle({
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

DefaultStyle.defaultProps = defaultProps;

export default DefaultStyle;
