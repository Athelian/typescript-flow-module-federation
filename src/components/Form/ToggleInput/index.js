// @flow
import * as React from 'react';
import Icon from 'components/Icon/index';
import { ToggleButtonStyle, ToggleInputStyle } from './style';

type OptionalProps = {
  onToggle: Function,
  editable: boolean,
};

type Props = OptionalProps & {
  toggled: boolean,
  children: React.Node,
};

const defaultProps = {
  editable: true,
  onToggle: () => {},
};

const ToggleInput = ({ toggled, onToggle, children, editable }: Props) => (
  <div className={ToggleInputStyle}>
    {children}
    <button
      type="button"
      className={ToggleButtonStyle(toggled, editable)}
      tabIndex={-1}
      onClick={editable ? onToggle : () => {}}
    >
      {toggled ? <Icon icon="TOGGLE_ON" /> : <Icon icon="TOGGLE_OFF" />}
    </button>
  </div>
);

ToggleInput.defaultProps = defaultProps;

export default ToggleInput;
