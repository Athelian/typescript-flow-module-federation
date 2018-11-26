// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ToggleButtonStyle } from './style';

type Props = {
  isOn: boolean,
};

export default function ToggleButton({ isOn, ...rest }: Props) {
  return (
    <button className={ToggleButtonStyle(isOn)} type="button" {...rest}>
      <Icon icon={isOn ? 'TOGGLE_ON' : 'TOGGLE_OFF'} />
    </button>
  );
}
