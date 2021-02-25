// @flow
import * as React from 'react';
import type { File } from 'generated/graphql';
import { createContainer } from 'unstated-next';
import { cleanFalsyAndTypeName, extractForbiddenId } from 'utils/data';
import { isEquals } from 'utils/fp';

const defaultState: File = {
  name: null,
  type: 'Document',
  size: null,
  path: null,
  memo: null,
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

    const parsedTags = [...mergedInitialState.tags.map(tag => extractForbiddenId(tag))];
    const finalState = { ...mergedInitialState, tags: parsedTags };
    setOriginalState(finalState);
  }, [initialState]);

  React.useEffect(() => setState(originalState), [originalState]);

  const initializeState = (value: Object) => {
    const mergedState = {
      ...defaultState,
      ...value,
    };
    const parsedTags = [...mergedState.tags.map(tag => extractForbiddenId(tag))];
    const finalState = { ...mergedState, tags: parsedTags };

    if (!isEquals(finalState, originalState)) {
      setOriginalState(finalState);
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

  const setFieldValues = (values: Object) => {
    setState((oldState: Object) => ({
      ...oldState,
      ...values,
    }));
  };

  return {
    state,
    originalState,
    initializeState,
    isDirty,
    resetState,
    setFieldValue,
    setFieldValues,
  };
};

const DocumentFormContainer = createContainer(useDocumentFormContainer);

export default DocumentFormContainer;
