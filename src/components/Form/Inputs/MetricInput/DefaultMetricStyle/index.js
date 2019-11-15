// @flow
// Don't need this file actually. We can use regular DefaultStyle component. Delete this when it is no longer being used in codebase
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

// TODO: remove this when old RM is removing
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
    id={id}
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
