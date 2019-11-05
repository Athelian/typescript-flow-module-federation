// @flow

import { useState, useCallback } from 'react';
import { number } from 'yup';
import type { MetricValue } from 'types';
import type { ValidationObject } from './type.js.flow';

function useMetricInput(initialValue: ?MetricValue, schema: ValidationObject) {
  const [metric, setMetric] = useState(initialValue || { value: 0, metric: '' });
  const [focus, setFocus] = useState(false);
  const hasError = schema.isRequired
    ? !number()
        .required()
        .isValidSync(metric.value)
    : false;
  const onChange = useCallback((newData: Object) => {
    if (newData && newData.target) {
      const {
        target: { value },
      } = newData;
      setMetric(value);
    }
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
