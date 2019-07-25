// @flow

import { useState, useCallback } from 'react';
import { number } from 'yup';
import { toFloatNullable, toFloat } from 'utils/number';
import type { ValidationObject } from './type.js.flow';

function useNumberInput(initialValue: number, schema: ValidationObject) {
  const [value, setValue] = useState(initialValue || 0);
  const [focus, setFocus] = useState(false);
  const hasError = schema.isRequired
    ? !number()
        .required()
        .isValidSync(value)
    : false;
  const onChange = useCallback((event: Object) => {
    if (event && event.currentTarget) {
      const newValue = toFloatNullable(event.currentTarget.value);
      setValue(newValue);
    }
  }, []);
  const onFocus = useCallback(() => {
    setFocus(true);
  }, []);
  const onBlur = useCallback((event: Object) => {
    if (event && event.currentTarget) {
      const newValue = toFloat(event.currentTarget.value);
      setValue(newValue);
    }
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

export default useNumberInput;
