// @flow
import * as React from 'react';
import BaseNumberInput from 'components/Form/Inputs/NumberInput';
import InputWrapper from '../InputWrapper';

type Props = {
  value: number | null,
  onChange: string => void,
  focus: boolean,
  onFocus: () => void,
  onBlur: () => void,
  onKeyDown: () => void,
  readonly: boolean,
};

const NumberInput = ({ value, focus, onChange, onFocus, onBlur, onKeyDown, readonly }: Props) => (
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
