// @flow
import * as React from 'react';
import type { File } from 'generated/graphql';
import { createContainer } from 'unstated-next';
import { cleanFalsyAndTypeName } from 'utils/data';
import { isEquals } from 'utils/fp';

const defaultState: File = {
  name: null,
  type: 'Document',
  status: 'Draft',
  size: null,
  path: null,
  description: null,
  tags: [],
  entity: null,
  order: null,
  orderItem: null,
  shipment: null,
  productProvider: null,
  milestone: null,
  updatedAt: null,
  updatedBy: null,
};

const useDocumentFormContainer = (initialState: File = defaultState) => {
  const [state: State, setState] = React.useState(defaultState);
  const [originalState: State, setOriginalState] = React.useState(defaultState);

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
