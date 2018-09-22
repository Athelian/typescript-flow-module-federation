// @flow
import * as React from 'react';
import { DefaultStyleWrapperStyle } from 'components/Form/Inputs/Styles/DefaultStyle/style';
import { VolumeUnitStyle } from './style';

type OptionalProps = {
  unit: string,
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
  unit: 'm²',
  isFocused: false,
  hasError: false,
  disabled: false,
  forceHoverStyle: false,
  width: '100%',
  height: '30px',
};

const DefaultVolumeStyle = ({
  unit,
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
    <div className={VolumeUnitStyle}>{unit}</div>
  </div>
);

DefaultVolumeStyle.defaultProps = defaultProps;

export default DefaultVolumeStyle;
