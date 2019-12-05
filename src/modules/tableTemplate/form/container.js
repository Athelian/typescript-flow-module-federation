// @flow
import * as React from 'react';
import { createContainer } from 'unstated-next';
import type { ColumnConfig } from 'components/Sheet/SheetState/types';
import { cleanFalsyAndTypeName, cleanUpData } from 'utils/data';
import { isEquals } from 'utils/fp';

const defaultState = {
  name: '',
  memo: '',
  type: 'Order',
  columns: [],
  updatedAt: '',
  updatedBy: null,
};

const useTableTemplateFormContainer = (intialState: Object = defaultState) => {
  const [originalState, setOriginalState] = React.useState({
    ...defaultState,
    ...cleanUpData(intialState),
  });
  const [state, setState] = React.useState({ ...defaultState, ...cleanUpData(intialState) });

  const initializeState = (value: Object) => {
    const mergedInitialState = { ...defaultState, ...cleanUpData(value) };
    if (!isEquals(mergedInitialState, originalState)) {
      setOriginalState(mergedInitialState);
    }
    if (!isEquals(mergedInitialState, state)) {
      setState(mergedInitialState);
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

  const selectAllColumns = () => {
    setState({ ...state, columns: state.columns.map(col => ({ ...col, hidden: false })) });
  };

  const unselectAllColumns = () => {
    setState({ ...state, columns: state.columns.map(col => ({ ...col, hidden: true })) });
  };

  const groupAllColumns = (groupedColumns: Object) =>
    setState({
      ...state,
      columns: Object.values(groupedColumns).flatMap(cols =>
        ((cols: any): Array<ColumnConfig>).sort((a, b) => {
          if (a.hidden && !b.hidden) {
            return 1;
          }

          if (!a.hidden && b.hidden) {
            return -1;
          }

          return 0;
        })
      ),
    });

  return {
    state,
    originalState,
    initializeState,
    isDirty,
    resetState,
    setFieldValue,
    selectAllColumns,
    unselectAllColumns,
    groupAllColumns,
  };
};

const TableTemplateFormContainer = createContainer(useTableTemplateFormContainer);

export default TableTemplateFormContainer;
