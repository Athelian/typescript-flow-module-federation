// @flow
import type { ColumnConfig } from '../TableRenderer';
import type { Action, CellValue, State, Position } from './index';

export function cellReducer(transformer: Object => Array<Array<CellValue>>) {
  const transformItems = (
    items: Array<Object>,
    columns: Array<ColumnConfig>
  ): Array<Array<CellValue>> => {
    return items
      .map(
        (item: Object) =>
          transformer(item).map(row =>
            columns.map(column => row.find(cell => column.key === cell.columnKey))
          ),
        {}
      )
      .flat();
  };

  function reducer(state: State, action: Action) {
    let targetCell: CellValue | null = null;
    if (action.cell) {
      targetCell = state.rows[action.cell.x][action.cell.y];
    }

    function getSafePosition(position: Position): Position {
      return {
        x: Math.max(0, Math.min(position.x, state.rows.length - 1)),
        y: Math.max(0, Math.min(position.y, state.rows[0].length - 1)),
      };
    }

    function getNextFocusablePosition(from: Position, getNext: Position => Position): Position {
      let current = from;

      while (true) {
        const next = getSafePosition(getNext(current));
        if (current.x === next.x && current.y === next.y) {
          return current;
        }

        current = next;

        const cell = state.rows[current.x][current.y];
        if (!cell.empty) {
          return current;
        }
      }
    }

    switch (action.type) {
      case 'init': {
        const { items, columns } = action.state;
        const rows = transformItems(items, columns);

        return {
          ...state,
          items,
          rows,
          focusedAt: null,
          weakFocusedAt: [],
        };
      }
      case 'append': {
        const { items, columns } = action.state;
        const rows = transformItems(items, columns);

        return {
          ...state,
          items: [...state.items, ...items],
          rows: [...state.rows, ...rows],
        };
      }
      case 'rearrange': {
        const columns = action.state;
        const rows = transformItems(state.items, columns);

        return {
          ...state,
          rows,
          focusedAt: null,
          weakFocusedAt: [],
        };
      }
      case 'focus': {
        if (!targetCell) {
          throw new Error('cell not found');
        }

        if (targetCell.empty) {
          return state;
        }

        const weakFocusedAt = targetCell.duplicatable
          ? state.rows.reduce((positions, row, x) => {
              row.forEach((cell, y) => {
                if (
                  targetCell.entity &&
                  cell.entity &&
                  targetCell.entity.id === cell.entity.id &&
                  targetCell.entity.type === cell.entity.type &&
                  targetCell.entity.field === cell.entity.field
                ) {
                  positions.push({ x, y });
                }
              });

              return positions;
            }, [])
          : [];

        return {
          ...state,
          focusedAt: action.cell,
          weakFocusedAt,
        };
      }
      case 'focus_up': {
        if (!state.focusedAt) {
          return state;
        }

        return reducer(state, {
          type: 'focus',
          cell: getNextFocusablePosition(state.focusedAt, pos => ({ ...pos, x: pos.x - 1 })),
        });
      }
      case 'focus_down': {
        if (!state.focusedAt) {
          return state;
        }

        return reducer(state, {
          type: 'focus',
          cell: getNextFocusablePosition(state.focusedAt, pos => ({ ...pos, x: pos.x + 1 })),
        });
      }
      case 'focus_right': {
        if (!state.focusedAt) {
          return state;
        }

        return reducer(state, {
          type: 'focus',
          cell: getNextFocusablePosition(state.focusedAt, pos => ({ ...pos, y: pos.y + 1 })),
        });
      }
      case 'focus_left': {
        if (!state.focusedAt) {
          return state;
        }

        return reducer(state, {
          type: 'focus',
          cell: getNextFocusablePosition(state.focusedAt, pos => ({ ...pos, y: pos.y - 1 })),
        });
      }
      default:
        throw new Error('invalid dispatch action');
    }
  }

  return reducer;
}
