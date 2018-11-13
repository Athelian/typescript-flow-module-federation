// @flow
// $FlowFixMe: it is open issue on flow repo https://github.com/facebook/flow/issues/7093
import { useState, useCallback } from 'react';

function useTagInput(initialValues: Array<Object>) {
  const [values, setValues] = useState(initialValues || []);
  const onChange = useCallback(newValues => {
    setValues(newValues);
  }, []);

  return {
    values,
    onChange,
  };
}

export default useTagInput;
