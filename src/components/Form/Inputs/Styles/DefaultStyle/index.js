// @flow
import * as React from 'react';
import {
  type OptionalProps as CommonOptionalProps,
  defaultProps as commonDefaultProps,
} from './type';
import { DefaultStyleWrapperStyle } from './style';

type OptionalProps = CommonOptionalProps & {
  transparent: boolean,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  transparent: false,
};

const DefaultStyle = ({
  type,
  isFocused,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  height,
  transparent,
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
      transparent,
    })}
  >
    {children}
  </div>
);

DefaultStyle.defaultProps = { ...defaultProps, ...commonDefaultProps };

export default DefaultStyle;
