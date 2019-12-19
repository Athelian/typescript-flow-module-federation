// @flow
import * as React from 'react';
import { createContainer } from 'unstated-next';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';

const defaultState = {
  name: null,
  type: 'Document',
  status: 'Draft',
  size: null,
  path: null,
  entity: null,
  memo: null,
  updatedAt: null,
  updatedBy: null,
};

const useDocumentFormContainer = (initialState: Object = defaultState) => {
  const [state, setState] = React.useState(defaultState);
  const [originalState, setOriginalState] = React.useState(defaultState);

  React.useEffect(() => {
    const mergedInitialState = {
      ...defaultState,
      ...initialState,
    };

    setOriginalState(mergedInitialState);
  }, [initialState]);

  React.useEffect(() => setState(originalState), [originalState]);

  const initializeState = (value: Object) => {
    const mergedState = {
      ...defaultState,
      ...value,
    };

    if (!isEquals(mergedState, originalState)) {
      setOriginalState(mergedState);
    }
  };

  const isDirty = !isEquals(cleanFalsyAndTypeName(state), cleanFalsyAndTypeName(originalState));

  const resetState = () => {
    setState(originalState);
  };

  const setFieldValue = (name: string, value: mixed) => {
    setState({
      ...state,
      [name]: value,
    });
  };

  return {
    state,
    originalState,
    initializeState,
    isDirty,
    resetState,
    setFieldValue,
  };
};

const DocumentFormContainer = createContainer(useDocumentFormContainer);

export default DocumentFormContainer;
