// @flow

import { useState, useCallback } from 'react';

function useTagInput(initialValues: Array<Object>) {
  const [values, setValues] = useState(initialValues || []);
  const onChange = useCallback((newValues: Array<Object>) => {
    setValues(newValues);
  }, []);

  return {
    values,
    onChange,
  };
}

export default useTagInput;
