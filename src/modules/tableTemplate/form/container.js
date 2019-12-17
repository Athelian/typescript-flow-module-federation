// @flow
import * as React from 'react';
import type { CustomFields, MaskEditColumn } from 'generated/graphql';
import { createContainer } from 'unstated-next';
import { cleanFalsyAndTypeName, cleanUpData } from 'utils/data';
import { isEquals } from 'utils/fp';
import { computeColumnConfigsFromState } from 'modules/tableTemplate/form/components/ColumnsConfigSection/helpers';

type State = {|
  columns: Array<MaskEditColumn>,
  name: ?string,
  memo: ?string,
  type: ?string,
  updatedAt: ?Date,
  updatedBy: ?Date,
  customFields: ?CustomFields,
|};

const defaultState: State = {
  name: null,
  memo: null,
  type: null,
  columns: [],
  updatedAt: null,
  updatedBy: null,
  customFields: null,
};

const useTableTemplateFormContainer = (initialState: State = defaultState) => {
  const [state, setState] = React.useState(defaultState);
  const [originalState, setOriginalState] = React.useState(defaultState);

  React.useEffect(() => {
    const mergedInitialState = {
      ...defaultState,
      ...cleanUpData(initialState),
    };

    setOriginalState({
      ...mergedInitialState,
      columns: computeColumnConfigsFromState(mergedInitialState).flatMap(col =>
        Array.isArray(col)
          ? [
              ...col.map(({ key, hidden }) => ({
                key,
                hidden,
              })),
            ]
          : {
              key: col.key,
              hidden: col.hidden,
            }
      ),
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
      columns: computeColumnConfigsFromState(mergedState).flatMap(col =>
        Array.isArray(col)
          ? [
              ...col.map(({ key, hidden }) => ({
                key,
                hidden,
              })),
            ]
          : {
              key: col.key,
              hidden: col.hidden,
            }
      ),
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
    setState({ ...state, columns: state.columns.map(({ key }) => ({ key, hidden: false })) });
  };

  const selectColumns = (selectedColumns: Array<MaskEditColumn | Array<MaskEditColumn>>) => {
    const { columns } = state;

    const newColumns: Array<MaskEditColumn> = [];
    const flattenColumns = selectedColumns.flatMap(col => (Array.isArray(col) ? [...col] : col));
    const flattenColumnKeys = selectedColumns.flatMap(col =>
      Array.isArray(col) ? [...col.map(({ key }) => key)] : col.key
    );
    let found = false;
    columns.forEach((column: MaskEditColumn) => {
      if (flattenColumnKeys.includes(column.key)) {
        if (!found) {
          newColumns.push(...flattenColumns);
          found = true;
        }
      } else {
        newColumns.push(column);
      }
    });

    setState({ ...state, columns: newColumns.map(({ key, hidden }) => ({ key, hidden })) });
  };

  const unselectAllColumns = () => {
    setState({ ...state, columns: state.columns.map(({ key }) => ({ key, hidden: true })) });
  };

  const groupAllColumns = (groupedColumns: Object) => {
    setState({
      ...state,
      columns: Object.values(groupedColumns)
        .flatMap((cols: any) => {
          const columns = [];
          const hiddenColumns = [];
          (cols: Array<MaskEditColumn | Array<MaskEditColumn>>).forEach(column => {
            if (Array.isArray(column)) {
              if (column.some(({ hidden }) => !hidden)) {
                columns.push(...column);
              } else {
                hiddenColumns.push(column);
              }
            } else if (column.hidden) {
              hiddenColumns.push(column);
            } else {
              columns.push(column);
            }
          });
          return [...columns, ...hiddenColumns];
        })
        .map(({ key, hidden }) => ({ key, hidden })),
    });
  };

  return {
    state,
    originalState,
    initializeState,
    isDirty,
    resetState,
    setFieldValue,
    selectColumns,
    selectAllColumns,
    unselectAllColumns,
    groupAllColumns,
  };
};

const TableTemplateFormContainer = createContainer(useTableTemplateFormContainer);

export default TableTemplateFormContainer;
