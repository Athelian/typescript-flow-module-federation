// @flow

import { useState, useCallback } from 'react';
import { isValid } from 'utils/date';
import { date } from 'yup';
import type { ValidationObject } from './type.js.flow';

function useDateInput(initialValue: string, schema: ValidationObject) {
  const [value, setValue] = useState(initialValue || '');
  const [focus, setFocus] = useState(false);
  const hasError = schema.isRequired
    ? !date()
        .required()
        .isValidSync(value)
    : false;
  const onChange = useCallback((event: Object) => {
    const newDate = new Date(event.currentTarget.value);
    if (event && event.currentTarget) setValue(isValid(newDate) ? newDate : null);
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

export default useDateInput;
