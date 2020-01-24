// @flow
import { getByPathWithDefault, setIn } from 'utils/fp';
import type { CellValue, State, ColumnSort } from 'components/Sheet/SheetState/types';
import { refresh } from './sheet';

export function changeValues(
  state: State,
  payload: {
    changes: Array<{
      entity: {
        id: string,
        type: string,
      },
      field: string,
      value: any,
    }>,
  }
): State {
  const { changes } = payload;
  if (changes.length === 0) {
    return state;
  }

  const cellsToUpdate = changes
    .map(({ entity, field, value }) => {
      return {
        cells: state.allRows.flatMap(row =>
          row.filter(
            cell =>
              cell.entity &&
              cell.data &&
              cell.entity?.id === entity.id &&
              cell.entity?.type === entity.type &&
              cell.data?.field === field
          )
        ),
        value,
      };
    })
    .filter(change => change.cells.length > 0);

  let { items } = state;
  cellsToUpdate.forEach(({ cells, value }) => {
    cells.forEach(cell => {
      // $FlowFixMe cell.data cannot be null since we filter cells before
      const { field, path } = cell.data;

      if (field.charAt(0) === '@') {
        const fieldDefinitionId = field.substr(1);
        let fieldValues = [...getByPathWithDefault([], `${path}.customFields.fieldValues`, items)];

        if (!fieldValues.find(fv => fv.fieldDefinition.id === fieldDefinitionId)) {
          fieldValues = [
            ...fieldValues,
            {
              value: { string: value },
              fieldDefinition: { id: fieldDefinitionId },
            },
          ];
        } else {
          fieldValues = fieldValues.map(fv =>
            fv.fieldDefinition.id === fieldDefinitionId
              ? {
                  value: { string: value },
                  fieldDefinition: { id: fieldDefinitionId },
                }
              : fv
          );
        }

        items = setIn(`${path}.customFields.fieldValues`, fieldValues, items);
      } else {
        items = setIn(path, value, items);
      }
    });
  });

  const clearError =
    state.errorAt &&
    cellsToUpdate.flatMap(({ cells }) => cells).find(cell => state.errorAt?.cell === cell);

  return {
    ...state,
    items,
    rows: state.rows.map(row =>
      row.map(cell => {
        if (!cell.data) {
          return cell;
        }

        const { data } = cell;
        const update = cellsToUpdate
          .map(({ cells, value }) => ({
            cell: cells.find(c => c?.data?.path === data.path && c?.data?.field === data.field),
            value,
          }))
          .find(c => !!c.cell);

        if (!update) {
          return cell;
        }

        return {
          ...cell,
          data: {
            ...data,
            value: update.value,
          },
        };
      })
    ),
    errorAt: clearError ? null : state.errorAt,
    weakErrorAt: clearError ? [] : state.weakErrorAt,
  };
}

export function cellUpdate(state: State, payload: { value: any }, target: CellValue): State {
  const { value } = payload;
  if (!target.entity || !target.data) {
    return state;
  }

  return changeValues(state, {
    changes: [
      {
        entity: target.entity,
        field: target.data.field,
        value,
      },
    ],
  });
}

export function replaceItem(
  transformer: (number, Object) => Array<Array<CellValue>>,
  sorter: (Array<Object>, Array<ColumnSort>) => Array<Object>
) {
  return (
    state: State,
    payload: {
      callback: (items: Array<Object>) => { item: Object, index: number } | null,
    }
  ): State => {
    const { callback } = payload;

    const itemToReplace = callback(state.items);
    if (!itemToReplace) {
      return state;
    }

    const items = [...state.items];
    items[itemToReplace.index] = itemToReplace.item;

    return refresh(transformer, sorter)(state, {
      items,
    });
  };
}

export function replaceItems(
  transformer: (number, Object) => Array<Array<CellValue>>,
  sorter: (Array<Object>, Array<ColumnSort>) => Array<Object>
) {
  return (
    state: State,
    payload: { callback: (items: Array<Object>) => Array<{ item: Object, index: number }> }
  ): State => {
    const { callback } = payload;

    const itemsToReplace = callback(state.items);

    const items = [...state.items];
    itemsToReplace.forEach(({ item, index }) => {
      items[index] = item;
    });

    return refresh(transformer, sorter)(state, {
      items,
    });
  };
}

export function deleteItem(
  transformer: (number, Object) => Array<Array<CellValue>>,
  sorter: (Array<Object>, Array<ColumnSort>) => Array<Object>
) {
  return (state: State, payload: { index: number }): State => {
    const { index } = payload;

    const items = [...state.items];
    items.splice(index, 1);

    return refresh(transformer, sorter)(state, {
      items,
    });
  };
}
