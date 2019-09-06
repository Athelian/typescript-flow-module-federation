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

const TextInput = ({ value, focus, onChange, onFocus, onBlur, onKeyDown, readonly }: Props) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    if (inputRef.current) {
      if (focus) {
        // $FlowIssue: Flow doesn't know focus options
        inputRef.current.focus({
          preventScroll: true,
        });
        if (value) {
          // $FlowFixMe: Already checked
          inputRef.current.setSelectionRange(0, value.length);
        }
      } else {
        inputRef.current.blur();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  return (
    <div className={WrapperStyle}>
      <BaseTextInput
        inputRef={inputRef}
        value={value || ''}
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
};

export default TextInput;
