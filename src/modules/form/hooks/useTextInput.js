// @flow
// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
import { useState, useCallback } from 'react';
import { string } from 'yup';
import type { ValidationObject } from './type.js.flow';

function useTextInput(initialValue: string, schema: ValidationObject) {
  const [value, setValue] = useState(initialValue || '');
  const [focus, setFocus] = useState(false);
  const hasError = schema.isRequired
    ? !string()
        .required()
        .isValidSync(value)
    : false;
  const onChange = useCallback(event => {
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
    onChange,
    onFocus,
    onBlur,
    isFocused: focus,
    hasError,
  };
}

export default useTextInput;
