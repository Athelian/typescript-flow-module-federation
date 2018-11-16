// @flow
// $FlowFixMe: it is open issue on flow repo https://github.com/facebook/flow/issues/7093
import { useState, useCallback } from 'react';
import { number } from 'yup';
import type { ValidationObject } from './type.js.flow';

function useMetricInput(
  initialValue: ?{ value: number, metric: string },
  schema: ValidationObject
) {
  const [metric, setMetric] = useState(initialValue || { value: 0, metric: '' });
  const [focus, setFocus] = useState(false);
  const hasError = schema.isRequired
    ? !number()
        .required()
        .isValidSync(metric.value)
    : false;
  const onChange = useCallback(newData => {
    setMetric(newData.target.value);
  }, []);
  const onFocus = useCallback(() => {
    setFocus(true);
  }, []);
  const onBlur = useCallback(() => {
    setFocus(false);
  }, []);

  return {
    value: metric,
    onChange,
    onFocus,
    onBlur,
    isFocused: focus,
    hasError,
  };
}

export default useMetricInput;
