// @flow
import { useState, useCallback } from 'react';
import { string } from 'yup';
import type { ValidationObject } from './type.js.flow';

function useTextInput(initialValue: string = '', schema: ValidationObject) {
  // $FlowFixMe: Missing type annotation.
  const [value, setValue] = useState(initialValue);
  const [focus, setFocus] = useState(false);
  const hasError = schema.isRequired
    ? !string()
        .required()
        .isValidSync(value)
    : false;
  const onChange = useCallback((event: Object) => {
    if (event && event.currentTarget) setValue(event.currentTarget.value);
  }, []);
  const onFocus = useCallback(() => {
    setFocus(true);
  }, []);
  const onBlur = useCallback(() => {
    setFocus(false);
  }, []);

  return {
    value,
    setValue,
    onChange,
    onFocus,
    onBlur,
    isFocused: focus,
    hasError,
  };
}

export default useTextInput;
