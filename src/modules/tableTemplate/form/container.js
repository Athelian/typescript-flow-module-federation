// @flow
import * as React from 'react';
import type { MaskEdit, MaskEditType } from 'generated/graphql';
import { MaskEditTypeValues } from 'generated/graphql';
import { createContainer } from 'unstated-next';
import { isEquals } from 'utils/fp';
import type { ColumnConfig } from 'components/Sheet';
import { getColumnsConfigured } from 'components/Sheet/useColumns';

type InitialState = {|
  type: MaskEditType,
  tableTemplate: ?MaskEdit,
  defaultColumns: Array<ColumnConfig>,
|};

type State = {|
  tableTemplate: ?MaskEdit,
  defaultColumns: Array<ColumnConfig>,
  isNew: boolean,
  values: {
    name: ?string,
    memo: ?string,
    type: MaskEditType,
    columns: Array<ColumnConfig>,
  },
|};

const defaultState: State = {
  tableTemplate: null,
  defaultColumns: [],
  isNew: false,
  values: {
    name: null,
    memo: null,
    type: MaskEditTypeValues.OrderSheet,
    columns: [],
  },
};

const useTableTemplateFormContainer = (initialState: InitialState) => {
  const [state, setState] = React.useState(defaultState);
  const [originalValues, setOriginalValues] = React.useState(defaultState.values);

  const initializeState = React.useCallback(
    (newTableTemplate: ?MaskEdit) => {
      const columns = newTableTemplate
        ? getColumnsConfigured(
            initialState.defaultColumns,
            newTableTemplate.columns.reduce(
              (object, item) => ({
                ...object,
                [item.key]: item.hidden,
              }),
              {}
            )
          )
        : initialState.defaultColumns;

      const newState = {
        tableTemplate: newTableTemplate,
        defaultColumns: initialState.defaultColumns,
        isNew: !newTableTemplate?.id,
        values: {
          name: newTableTemplate?.name ?? null,
          memo: newTableTemplate?.memo ?? null,
          type: initialState.type,
          columns,
        },
      };

      setState(newState);
      setOriginalValues(newState.values);
    },
    [initialState.type, initialState.defaultColumns]
  );

  React.useEffect(() => {
    initializeState(initialState.tableTemplate);
  }, [initializeState, initialState.tableTemplate]);

  const isDirty = React.useMemo(() => !isEquals(state.values, originalValues), [
    state.values,
    originalValues,
  ]);

  const resetState = React.useCallback(() => {
    setState({
      ...state,
      values: { ...originalValues },
    });
  }, [state, originalValues]);

  const setFieldValue = React.useCallback(
    (name: string, value: mixed) => {
      setState({
        ...state,
        values: {
          ...state.values,
          [name]: value,
        },
      });
    },
    [state]
  );

  const selectAllColumns = () => {
    setFieldValue(
      'columns',
      state.values.columns.map(col => ({ ...col, hidden: false }))
    );
  };

  const unselectAllColumns = () => {
    setFieldValue(
      'columns',
      state.values.columns.map(col => ({ ...col, hidden: true }))
    );
  };

  const selectColumns = (selectedColumns: Array<ColumnConfig | Array<ColumnConfig>>) => {
    const { columns } = state.values;

    const newColumns: Array<ColumnConfig> = [];
    const flattenColumns = selectedColumns.flatMap(col => (Array.isArray(col) ? [...col] : col));
    const flattenColumnKeys = selectedColumns.flatMap(col =>
      Array.isArray(col) ? [...col.map(({ key }) => key)] : col.key
    );
    let found = false;
    columns.forEach((column: ColumnConfig) => {
      if (flattenColumnKeys.includes(column.key)) {
        if (!found) {
          newColumns.push(...flattenColumns);
          found = true;
        }
      } else {
        newColumns.push(column);
      }
    });

    setFieldValue('columns', newColumns);
  };

  const groupAllColumns = (groupedColumns: Object) => {
    const newColumns = Object.values(groupedColumns).flatMap((cols: any) => {
      const columns = [];
      const hiddenColumns = [];
      (cols: Array<ColumnConfig | Array<ColumnConfig>>).forEach(column => {
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
    });

    setFieldValue('columns', newColumns);
  };

  const reorderToDefault = () => {
    setFieldValue(
      'columns',
      state.defaultColumns.map(defaultColumn => ({
        ...defaultColumn,
        hidden: state.values.columns.find(col => col.key === defaultColumn.key)?.hidden ?? false,
      }))
    );
  };

  return {
    state,
    originalValues,
    isDirty,
    initializeState,
    resetState,
    setFieldValue,
    selectColumns,
    selectAllColumns,
    unselectAllColumns,
    groupAllColumns,
    reorderToDefault,
  };
};

const TableTemplateFormContainer = createContainer(useTableTemplateFormContainer);

export default TableTemplateFormContainer;
