// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { OrderHeaderCheckBoxButtonStyle, OrderHeaderStyle } from './style';

type Props = {
  isChecked: boolean,
  onToggle: Function,
  label: string,
};

const OrderHeaderCheckBox = ({ isChecked, onToggle, label }: Props) => (
  <>
    <div className={OrderHeaderStyle(isChecked)}>
      <button
        type="button"
        className={OrderHeaderCheckBoxButtonStyle(isChecked)}
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
