// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { OrderHeaderCheckBoxButtonStyle, OrderHeaderStyle } from './style';

type OptionalProps = {
  onToggle?: Function,
};

type Props = OptionalProps & {
  isChecked: boolean,
  label: string,
};

const ENABLE_ACTION_CHECK = false;

const OrderHeader = ({ isChecked, onToggle, label }: Props) => (
  <div className={OrderHeaderStyle(isChecked)}>
    {ENABLE_ACTION_CHECK && (
      <button
        type="button"
        className={OrderHeaderCheckBoxButtonStyle(isChecked)}
        tabIndex={-1}
        onClick={onToggle}
      >
        <Icon icon="ORDER_SELECT" />
      </button>
    )}
    <span>{label}</span>
  </div>
);

export default OrderHeader;
