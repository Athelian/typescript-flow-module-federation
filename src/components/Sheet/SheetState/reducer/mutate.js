// @flow
import { clone } from 'utils/fp';
import type { CellValue, State } from '../types';
import { refresh } from './global';

/**
 * `setIn` from "utils/fp" or `set` from "lodash" doesn't work for unknown reasons.
 */
function set(subject: any, path: string, value: any): any {
  let cursor = subject;

  const keys = path.split('.');

  keys.forEach((key, index) => {
    if (index < keys.length - 1) {
      cursor = cursor[key];
    } else {
      cursor[key] = value;
    }
  });

  return subject;
}

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
        cells: state.rows
          .map(row =>
            row.filter(cell => {
              return (
                cell.entity &&
                cell.data &&
                cell.entity?.id === entity.id &&
                cell.entity?.type === entity.type &&
                cell.data?.field === field
              );
            })
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
      items = set(items, cell.data.path, value);
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
        const update = cellsToUpdate
          .map(({ cells, value }) => {
            return {
              cell: cells.find(c => c === cell),
              value,
            };
          })
          .find(c => !!c.cell);

        if (!update) {
          return cell;
        }

        return {
          ...cell,
          data: {
            ...cell.data,
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

export function replaceItem(transformer: (number, Object) => Array<Array<CellValue>>) {
  return (state: State, payload: { item: Object, index: number }): State => {
    const { item, index } = payload;

    const items = [...state.items];
    items[index] = item;

    return refresh(transformer)(state, {
      items,
      columns: state.columns,
    });
  };
}

export function deleteItem(transformer: (number, Object) => Array<Array<CellValue>>) {
  return (state: State, payload: { index: number }): State => {
    const { index } = payload;

    const items = [...state.items];
    items.splice(index, 1);

    return refresh(transformer)(state, {
      items,
      columns: state.columns,
    });
  };
}
