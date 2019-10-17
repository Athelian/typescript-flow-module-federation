// @flow
import * as React from 'react';
import BaseTextInput from 'components/Form/Inputs/TextInput';
import type { InputProps } from '../../types';
import InputWrapper from '../InputWrapper';

const TextInput = ({
  value,
  focus,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  readonly,
}: InputProps<string>) => (
  <InputWrapper focus={focus} preselect>
    {({ ref }) => (
      <BaseTextInput
        inputRef={ref}
        value={value || ''}
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

export default TextInput;
