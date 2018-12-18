// @flow
import * as React from 'react';
import {
  type OptionalProps as CommonOptionalProps,
  defaultProps as commonDefaultProps,
} from './type';
import { DefaultStyleWrapperStyle } from './style';

type OptionalProps = CommonOptionalProps & {
  transparent: boolean,
  tabindex?: string,
  id?: string,
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
  id,
  tabindex,
}: Props): React.Node => (
  <div
    {...(id ? { id } : {})}
    {...(tabindex ? { tabindex } : {})}
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
