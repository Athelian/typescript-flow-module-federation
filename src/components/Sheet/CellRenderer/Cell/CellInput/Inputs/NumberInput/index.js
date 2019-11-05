// @flow
import * as React from 'react';
import BaseNumberInput from 'components/Inputs/NumberInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellInputWrapperStyle,
  InputStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';

const NumberInput = ({ value, onChange, readonly }: InputProps<string>) => (
  <div className={CellInputWrapperStyle}>
    <BaseNumberInput
      className={InputStyle}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      disabled={readonly}
    />
  </div>
);

export default NumberInput;
