// @flow
// $FlowFixMe: it is open issue on flow repo https://github.com/facebook/flow/issues/7093
import { useState, useCallback } from 'react';
import type { ValidationObject } from './type.js.flow';

function useNumberInput(initialValue: number, schema: ValidationObject) {
  const [value, setValue] = useState(initialValue || 0);
  const [focus, setFocus] = useState(false);
  const hasError = schema.isRequired ? !value : false;
  const onChange = useCallback(event => {
    setValue(Number(event.currentTarget.value));
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

export default useNumberInput;
