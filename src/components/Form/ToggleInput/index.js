// @flow
import * as React from 'react';
import Icon from 'components/Icon/index';
import { ToggleButtonStyle, ToggleInputStyle } from './style';

type Props = {
  toggled: boolean,
  onToggle: Function,
  children: React.Node,
};

const ToggleInput = ({ toggled, onToggle, children }: Props) => (
  <div className={ToggleInputStyle(toggled)}>
    {children}
    <button type="button" className={ToggleButtonStyle(toggled)} tabIndex={-1} onClick={onToggle}>
      {toggled ? <Icon icon="TOGGLE_ON" /> : <Icon icon="TOGGLE_OFF" />}
    </button>
  </div>
);

export default ToggleInput;
