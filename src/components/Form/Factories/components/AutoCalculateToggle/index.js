// @flow
import * as React from 'react';
import { ToggleInput } from 'components/Form';
import { AutoCalculateToggleStyle } from './style';

type Props = {
  toggled: boolean,
  onClick?: Function,
};

const AutoCalculateToggle = ({ toggled, onClick, ...rest }: Props): React.Node => (
  <div className={AutoCalculateToggleStyle}>
    <ToggleInput {...rest} toggled={toggled} onToggle={onClick} />
  </div>
);

export default AutoCalculateToggle;
