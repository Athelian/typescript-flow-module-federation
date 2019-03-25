// @flow
import * as React from 'react';
import { ToggleInput } from 'components/Form';
import { ExtraToggleButtonStyle } from './style';

type Props = {
  toggled: boolean,
  onClick?: Function,
};

const ExtraToggleButton = ({ toggled, onClick, ...rest }: Props): React.Node => (
  <div className={ExtraToggleButtonStyle}>
    <ToggleInput {...rest} toggled={toggled} onToggle={onClick} />
  </div>
);

export default ExtraToggleButton;
