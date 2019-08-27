// @flow
import * as React from 'react';
import BaseTextInput from 'components/Form/Inputs/TextInput';
import { WrapperStyle } from './style';

type Props = {
  value: string | null,
  onChange: string => void,
  onBlur: () => void,
  readonly: boolean,
};

const TextInput = ({ value, onChange, onBlur, readonly }: Props) => {
  return (
    <div className={WrapperStyle}>
      <BaseTextInput
        value={value}
        name="value"
        readOnly={readonly}
        readOnlyHeight="30px"
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={e => {
          e.stopPropagation();
        }}
      />
    </div>
  );
};

export default TextInput;
