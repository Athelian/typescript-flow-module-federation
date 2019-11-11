// @flow
import { clone, setIn } from 'utils/fp';
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
        cells: state.allRows
          .map(row =>
            row.filter(
              cell =>
                cell.entity &&
                cell.data &&
                cell.entity?.id === entity.id &&
                cell.entity?.type === entity.type &&
                cell.data?.field === field
            )
          )
          // $FlowFixMe flow doesn't support flat()
          .flat(),
        value,
      };
    })
    .filter(change => change.cells.length > 0);

  let items = clone(state.items);
  cellsToUpdate.forEach(({ cells, value }) => {
    cells.forEach(cell => {
      items = setIn(cell.data.path, value, items);
    });
  });

  const clearError =
    state.errorAt &&
    cellsToUpdate
      .map(({ cells }) => cells)
      // $FlowFixMe flow doesn't support flat()
      .flat()
      .find(cell => state.errorAt?.cell === cell);

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
            cell: cells.find(c => c?.data?.path === data.path),
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
  return (state: State, payload: { item: Object, index: number }): State => {
    const { item, index } = payload;

    const items = [...state.items];
    items[index] = item;

    return refresh(transformer, sorter)(state, {
      items,
    });
  };
}

export function replaceItems(
  transformer: (number, Object) => Array<Array<CellValue>>,
  sorter: (Array<Object>, Array<ColumnSort>) => Array<Object>
) {
  return (state: State, payload: { items: Array<{ item: Object, index: number }> }): State => {
    const items = [...state.items];
    (payload?.items ?? []).forEach(({ item, index }) => {
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
