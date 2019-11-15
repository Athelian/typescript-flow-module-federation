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
    /* $FlowFixMe This comment suppresses an error found when upgrading Flow to
     * v0.112.0. To view the error, delete this comment and run Flow. */
    <button className={ToggleButtonStyle(isOn, hideToggle)} type="button" {...rest}>
      <Icon icon={isOn ? 'TOGGLE_ON' : 'TOGGLE_OFF'} />
    </button>
  );
}

ToggleButton.defaultProps = defaultProps;
