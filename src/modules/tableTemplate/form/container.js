// @flow
import * as React from 'react';
import { createContainer } from 'unstated-next';
import type { ColumnConfig } from 'components/Sheet/SheetState/types';
import { cleanFalsyAndTypeName, cleanUpData } from 'utils/data';
import { isEquals } from 'utils/fp';
import { computeColumnConfigsFromState } from 'modules/tableTemplate/form/components/ColumnsConfigSection/helpers';

const defaultState = {
  name: null,
  memo: null,
  type: null,
  columns: [],
  updatedAt: null,
  updatedBy: null,
  customFields: null,
};

const useTableTemplateFormContainer = (initialState: Object = defaultState) => {
  const [state, setState] = React.useState(defaultState);
  const [originalState, setOriginalState] = React.useState(defaultState);

  React.useEffect(() => {
    const mergedInitialState = {
      ...defaultState,
      ...cleanUpData(initialState),
    };

    setOriginalState({
      ...mergedInitialState,
      columns: computeColumnConfigsFromState(mergedInitialState).map(col => ({
        key: col.key,
        hidden: col.hidden,
      })),
    });
  }, [initialState]);

  React.useEffect(() => setState(originalState), [originalState]);

  const initializeState = (value: Object) => {
    const mergedState = {
      ...defaultState,
      ...cleanUpData(value),
    };

    const compiledState = {
      ...mergedState,
      columns: computeColumnConfigsFromState(mergedState).map(col => ({
        key: col.key,
        hidden: col.hidden,
      })),
    };

    if (!isEquals(compiledState, originalState)) {
      setOriginalState(compiledState);
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
        ((cols: any): Array<ColumnConfig>)
          .map(col => ({ key: col.key, hidden: col.hidden }))
          .sort((a, b) => {
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
