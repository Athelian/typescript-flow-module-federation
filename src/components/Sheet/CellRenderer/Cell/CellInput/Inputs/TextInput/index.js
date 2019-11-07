// @flow
import * as React from 'react';
import BaseTextInput from 'components/Inputs/TextInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellInputWrapperStyle,
  InputStyle,
} from 'components/Sheet/CellRenderer/Cell/CellInput/Common/style';

const TextInput = ({ value, onChange, readonly }: InputProps<string>) => (
  <div className={CellInputWrapperStyle}>
    <BaseTextInput
      className={InputStyle}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      disabled={readonly}
    />
  </div>
);

export default TextInput;
