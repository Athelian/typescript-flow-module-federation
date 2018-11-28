// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ToggleButtonStyle } from './style';

type OptionalProps = {
  hideToggle: boolean,
};

type Props = OptionalProps & {
  isOn: boolean,
};

const defaultProps = {
  hideToggle: false,
};

export default function ToggleButton({ isOn, hideToggle, ...rest }: Props) {
  return (
    <button className={ToggleButtonStyle(isOn, hideToggle)} type="button" {...rest}>
      <Icon icon={isOn ? 'TOGGLE_ON' : 'TOGGLE_OFF'} />
    </button>
  );
}

ToggleButton.defaultProps = defaultProps;
