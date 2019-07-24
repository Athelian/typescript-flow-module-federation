// @flow

import { useState, useCallback } from 'react';

function useTagInput(initialValues: Array<Object>) {
  const [tags, setValues] = useState(initialValues || []);
  const onChange = useCallback((newValues: Array<Object>) => {
    setValues(newValues);
  }, []);

  return {
    tags,
    onChange,
  };
}

export default useTagInput;
