// @flow
import * as React from 'react';
import BaseDateInput from 'components/Form/Inputs/DateInput';
import InputWrapper from '../InputWrapper';

type Props = {
  value: Date | string | null,
  onChange: string => void,
  focus: boolean,
  onFocus: () => void,
  onBlur: () => void,
  onKeyDown: () => void,
  readonly: boolean,
};

const DateInput = ({ value, focus, onChange, onFocus, onBlur, onKeyDown, readonly }: Props) => (
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
