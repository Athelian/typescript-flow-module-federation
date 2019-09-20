// @flow
import * as React from 'react';
import BaseTextInput from 'components/Form/Inputs/TextInput';
import InputWrapper from '../InputWrapper';

type Props = {
  value: string | null,
  onChange: string => void,
  focus: boolean,
  onFocus: () => void,
  onBlur: () => void,
  onKeyDown: () => void,
  readonly: boolean,
};

const TextInput = ({ value, focus, onChange, onFocus, onBlur, onKeyDown, readonly }: Props) => (
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
