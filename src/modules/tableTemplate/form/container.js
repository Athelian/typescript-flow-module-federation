// @flow
import * as React from 'react';
import type { CustomFields, MaskEditColumn } from 'generated/graphql';
import { createContainer } from 'unstated-next';
import { cleanFalsyAndTypeName, cleanUpData } from 'utils/data';
import { isEquals } from 'utils/fp';
import {
  getColumnsConfig,
  computeColumnConfigsFromState,
} from 'modules/tableTemplate/form/components/ColumnsConfigSection/helpers';

type State = {|
  columns: Array<{ ...MaskEditColumn, isNew?: boolean }>,
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
  const columnKeys = React.useRef([]);

  React.useEffect(() => {
    const mergedInitialState = {
      ...defaultState,
      ...cleanUpData(initialState),
    };

    columnKeys.current = mergedInitialState.columns.map(column => column.key);

    setOriginalState({
      ...mergedInitialState,
      columns: computeColumnConfigsFromState(mergedInitialState).flatMap(col =>
        Array.isArray(col)
          ? [
              ...col.map(({ key, hidden, isNew }) => ({
                key,
                hidden,
                isNew,
              })),
            ]
          : {
              key: col.key,
              hidden: col.hidden,
              isNew: col.isNew,
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
    columnKeys.current = mergedState.columns.map(column => column.key);

    const compiledState = {
      ...mergedState,
      columns: computeColumnConfigsFromState(mergedState).flatMap(col =>
        Array.isArray(col)
          ? [
              ...col.map(({ key, hidden, isNew }) => ({
                key,
                hidden,
                isNew,
              })),
            ]
          : {
              key: col.key,
              hidden: col.hidden,
              isNew: col.isNew,
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
    setState({
      ...state,
      columns: state.columns.map(({ key, isNew }) => ({ key, hidden: false, isNew: !!isNew })),
    });
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

    setState({
      ...state,
      columns: newColumns.map(({ key, hidden, isNew }) => ({ key, hidden, isNew: !!isNew })),
    });
  };

  const unselectAllColumns = () => {
    setState({
      ...state,
      columns: state.columns.map(({ key, isNew }) => ({ key, hidden: true, isNew: !!isNew })),
    });
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
                hiddenColumns.push(...column);
              }
            } else if (column.hidden) {
              hiddenColumns.push(column);
            } else {
              columns.push(column);
            }
          });
          return [...columns, ...hiddenColumns];
        })
        .map(({ key, hidden, isNew }) => ({ key, hidden, isNew: !!isNew })),
    });
  };

  const getColumnKeys = () => {
    if (columnKeys.current.length === 0) return state.columns.map(column => column.key);
    return columnKeys.current;
  };

  const defaultColumns = () => {
    const columns = getColumnsConfig({
      type: state.type || 'Order',
      customFields: state.customFields,
      columnsKeys: getColumnKeys(),
    });
    setState({
      ...state,
      columns: columns.map(({ key, isNew }) => ({
        key,
        isNew,
        hidden: state.columns.find(col => col.key === key)?.hidden ?? false,
      })),
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
    defaultColumns,
    getColumnKeys,
  };
};

const TableTemplateFormContainer = createContainer(useTableTemplateFormContainer);

export default TableTemplateFormContainer;
