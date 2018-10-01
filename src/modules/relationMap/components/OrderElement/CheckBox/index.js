// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { ToggleButtonStyle, CheckBoxStyle } from './style';

type Props = {
  isChecked: boolean,
  onToggle: Function,
  label: string,
};

const OrderHeaderCheckBox = ({ isChecked, onToggle, label }: Props) => (
  <>
    <div className={CheckBoxStyle(isChecked)}>
      <button
        type="button"
        className={ToggleButtonStyle(isChecked)}
        tabIndex={-1}
        onClick={onToggle}
      >
        <Icon icon="ORDER_SELECT" />
      </button>
      <span>{label}</span>
    </div>
  </>
);

export default OrderHeaderCheckBox;
