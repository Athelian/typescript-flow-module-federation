// @flow
import { useState, useCallback } from 'react';
import { string } from 'yup';
import type { ValidationObject } from './type.js.flow';

function useTextInput(initialValue: string = '', schema: ValidationObject) {
  const [value, setValue] = useState(initialValue || '');
  const [focus, setFocus] = useState(false);

  let hasError = false;

  if (schema.isRequired) {
    hasError = !string()
      .required()
      .isValidSync(value);
  }

  if (schema.validator) {
    hasError = !schema.validator.isValidSync(value);
  }

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
    onChange,
    onFocus,
    onBlur,
    isFocused: focus,
    hasError,
  };
}

export default useTextInput;
