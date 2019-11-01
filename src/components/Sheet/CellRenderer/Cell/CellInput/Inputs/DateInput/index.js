// @flow
import * as React from 'react';
import BaseDateInput from 'components/Form/Inputs/DateInput';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import InputWrapper from '../InputWrapper';

const DateInput = ({
  value,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: InputProps<Date | string>) => (
  <InputWrapper focus={focus}>
    {({ ref }) => (
      <BaseDateInput
        inputRef={ref}
        value={value}
        name="value"
        tabIndex="-1"
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

export default DateInput;
