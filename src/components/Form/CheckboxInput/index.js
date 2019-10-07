// @flow
import * as React from 'react';
import Icon from 'components/Icon/index';
import { CheckboxInputStyle } from './style';

type Props = {
  checked: boolean,
  onToggle: Function,
  disabled?: boolean,
};

const CheckboxInput = ({ checked, onToggle, disabled }: Props) => (
  <button
    type="button"
    className={CheckboxInputStyle(checked)}
    tabIndex={-1}
    onClick={onToggle}
    disabled={disabled}
  >
    <Icon icon="CONFIRM" />
  </button>
);

export default CheckboxInput;
