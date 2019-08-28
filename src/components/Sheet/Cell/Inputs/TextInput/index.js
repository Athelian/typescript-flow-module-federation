// @flow
import * as React from 'react';
import BaseTextInput from 'components/Form/Inputs/TextInput';
import { WrapperStyle } from './style';

type Props = {
  value: string | null,
  onChange: string => void,
  onBlur: () => void,
  onKeyDown: () => void,
  readonly: boolean,
};

const TextInput = React.forwardRef(
  ({ value, onChange, onBlur, onKeyDown, readonly }: Props, ref) => {
    return (
      <div className={WrapperStyle}>
        <BaseTextInput
          inputRef={ref}
          value={value}
          name="value"
          tabIndex="-1"
          readOnly={readonly}
          readOnlyHeight="30px"
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      </div>
    );
  }
);

export default TextInput;
