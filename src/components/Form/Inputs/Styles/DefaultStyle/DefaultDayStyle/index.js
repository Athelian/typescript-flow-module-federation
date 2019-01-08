// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DefaultStyleWrapperStyle } from 'components/Form/Inputs/Styles/DefaultStyle/style';
import { MetricStyle } from './style';

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
};

const defaultProps = {
  isFocused: false,
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
  height: '30px',
};

const DefaultDayStyle = ({
  isFocused,
  hasError,
  disabled,
  forceHoverStyle,
  width,
  height,
  children,
}: Props) => (
  <div
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
    <div className={MetricStyle}>
      <FormattedMessage id="components.form.days" defaultMessage="Days" />
    </div>
  </div>
);

DefaultDayStyle.defaultProps = defaultProps;

export default DefaultDayStyle;
