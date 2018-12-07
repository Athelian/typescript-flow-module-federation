// @flow
import * as React from 'react';
import Icon from 'components/Icon/index';
import { CheckboxInputStyle } from './style';

type Props = {
  checked: boolean,
  onToggle: Function,
};

const CheckboxInput = ({ checked, onToggle }: Props) => (
  <button type="button" className={CheckboxInputStyle(checked)} tabIndex={-1} onClick={onToggle}>
    <Icon icon="CONFIRM" />
  </button>
);

export default CheckboxInput;
