// @flow
import * as React from 'react';
import { DefaultStyleWrapperStyle } from 'components/Form/Inputs/Styles/DefaultStyle/style';

type OptionalProps = {
  isFocused: boolean,
  hasError: boolean,
  disabled: boolean,
  forceHoverStyle: boolean,
  width: string,
  height: string,
};

type Props = OptionalProps & {
  children: React.Node,
  id?: string,
  tabIndex?: string,
};

const defaultProps = {
  isFocused: false,
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
  height: '30px',
};

const DefaultMetricStyle = ({
  isFocused,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  height,
  children,
  id,
  tabIndex,
}: Props): React.Node => (
  <div
    {...(id ? { id } : {})}
    {...(tabIndex ? { tabIndex } : {})}
    className={DefaultStyleWrapperStyle({
      type: 'number',
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

DefaultMetricStyle.defaultProps = defaultProps;

export default DefaultMetricStyle;
