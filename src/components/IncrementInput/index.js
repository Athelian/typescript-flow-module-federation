// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import {
  IncrementInputWrapperStyle,
  IncrementButtonStyle,
  IncrementContentStyle,
} from 'components/IncrementInput/style';

type Props = {
  value: number,
  onMinus: Function,
  onPlus: Function,
};

const IncrementInput = ({ value, onMinus, onPlus }: Props) => {
  return (
    <div className={IncrementInputWrapperStyle}>
      <button
        data-testid="decreaseButton"
        className={IncrementButtonStyle}
        onClick={onMinus}
        type="button"
      >
        <Icon icon="MINUS" />
      </button>
      <input className={IncrementContentStyle} type="number" readOnly min={0} value={value} />
      <button
        data-testid="increaseButton"
        className={IncrementButtonStyle}
        onClick={onPlus}
        type="button"
      >
        <Icon icon="ADD" />
      </button>
    </div>
  );
};

export default IncrementInput;
