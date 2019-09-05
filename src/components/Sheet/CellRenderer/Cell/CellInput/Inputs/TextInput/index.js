// @flow
import * as React from 'react';
import BaseTextInput from 'components/Form/Inputs/TextInput';
import { WrapperStyle } from './style';

type Props = {
  value: string | null,
  onChange: string => void,
  focus: boolean,
  onFocus: () => void,
  onBlur: () => void,
  onKeyDown: () => void,
  readonly: boolean,
};

const TextInput = React.forwardRef<Props, HTMLInputElement>(
  ({ value, focus, onChange, onFocus, onBlur, onKeyDown, readonly }: Props, ref) => {
    return (
      <div className={WrapperStyle}>
        <BaseTextInput
          inputRef={ref}
          value={value || ''}
          focus={focus}
          name="value"
          tabIndex="-1"
          readOnly={readonly}
          readOnlyHeight="30px"
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      </div>
    );
  }
);

export default TextInput;
