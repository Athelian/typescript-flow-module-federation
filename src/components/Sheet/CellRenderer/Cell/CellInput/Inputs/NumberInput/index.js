// @flow
import * as React from 'react';
import BaseNumberInput from 'components/Form/Inputs/NumberInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import InputWrapper from '../InputWrapper';

const NumberInput = ({
  value,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: InputProps<number>) => (
  <InputWrapper focus={focus} preselect>
    {({ ref }) => (
      <BaseNumberInput
        inputRef={ref}
        value={value}
        name="value"
        tabIndex="-1"
        nullable={false}
        readOnly={readonly}
        readOnlyHeight="30px"
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    )}
  </InputWrapper>
);

export default NumberInput;
