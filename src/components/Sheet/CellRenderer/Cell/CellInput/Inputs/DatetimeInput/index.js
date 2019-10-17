// @flow
import * as React from 'react';
import BaseDateTimeInput from 'components/Form/Inputs/DateTimeInput';
import type { InputProps } from '../../types';
import InputWrapper from '../InputWrapper';

const DatetimeInput = ({
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
      <BaseDateTimeInput
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

export default DatetimeInput;
