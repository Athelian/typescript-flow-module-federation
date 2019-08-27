// @flow
import type { ColumnConfig } from '../SheetRenderer';
import type { Action, CellValue, State, Position, ForeignFocus } from './index';

function getEntities(rows: Array<Array<CellValue>>): Array<{ id: string, type: string }> {
  return Array.from(
    rows
      .map(row =>
        row
          .filter(cell => !!cell.entity)
          // $FlowFixMe nullable cell.entity is already filtered
          .map(cell => ({ id: cell.entity.id, type: cell.entity.type }))
      )
      // $FlowFixMe flow doesn't support flat()
      .flat()
      .reduce((m, e) => {
        m.set(`${e.type}:${e.id}`, e);
        return m;
      }, new Map())
      .values()
  );
}

function getForeignFocusedAt(rows: Array<Array<CellValue>>, focus: Object): Array<ForeignFocus> {
  return rows
    .reduce((positions, row, x) => {
      row.forEach((cell, y) => {
        if (
          cell.entity &&
          cell.entity.id === focus.entity.id &&
          cell.entity.type === focus.entity.__typename &&
          cell.entity.field === focus.field
        ) {
          positions.push({ x, y });
        }
      });

      return positions;
    }, [])
    .map(pos => ({
      id: focus.id,
      user: focus.user,
      ...pos,
    }));
}

function extendParentCells(rows: Array<Array<CellValue>>): Array<Array<CellValue>> {
  return rows.map((row, x) =>
    row.map((cell, y) => {
      if (!cell.parent) {
        return cell;
      }

      let i = x + 1;
      let extended = 0;
      while (true) {
        if (rows.length <= i) {
          break;
        }

        const bottomCell = rows[i][y];
        if (bottomCell.empty) {
          extended += 1;
        } else {
          break;
        }

        i += 1;
      }

      return {
        ...cell,
        extended,
      };
    })
  );
}

export function cellReducer(transformer: Object => Array<Array<CellValue>>) {
  const transformItems = (
    items: Array<Object>,
    columns: Array<ColumnConfig>
  ): Array<Array<CellValue>> => {
    return (
      items
        .map(
          (item: Object) =>
            transformer(item).map(row =>
              columns.map(column => row.find(cell => column.key === cell.columnKey))
            ),
          {}
        )
        // $FlowFixMe flow doesn't support flat()
        .flat()
    );
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

    function getFocusableFromEmpty(from: Position): Position {
      let current = from;

      while (true) {
        current = getSafePosition({ x: current.x - 1, y: current.y });
        const cell = state.rows[current.x][current.y];

        if (!cell.empty) {
          break;
        }
      }

      return current;
    }

    function getNextFocusable(
      from: Position,
      getNext: Position => Position,
      skipEmpty: boolean
    ): Position {
      let current = from;

      while (true) {
        const next = getSafePosition(getNext(current));
        if (current.x === next.x && current.y === next.y) {
          break;
        }

        current = next;

        const cell = state.rows[current.x][current.y];

        if (!cell.empty) {
          break;
        } else if (cell.empty && !skipEmpty) {
          current = getFocusableFromEmpty(current);
          break;
        }
      }

      return current;
    }

    switch (action.type) {
      case 'init': {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const { items, columns } = action.payload;
        const rows = extendParentCells(transformItems(items, columns));
        const entities = getEntities(rows);

        return {
          ...state,
          initialized: true,
          items,
          rows,
          entities,
          focusedAt: null,
          weakFocusedAt: [],
          foreignFocuses: [],
          foreignFocusedAt: [],
        };
      }
      case 'append': {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const { items, columns } = action.payload;
        const rows = extendParentCells(transformItems(items, columns));
        const entities = getEntities(rows);
        const foreignFocusedAt = state.foreignFocuses
          .map(focus => getForeignFocusedAt(rows, focus))
          // $FlowFixMe flow doesn't support flat()
          .flat();

        return {
          ...state,
          items: [...state.items, ...items],
          rows: [...state.rows, ...rows],
          entities: [...state.entities, ...entities],
          foreignFocusedAt: [...state.foreignFocusedAt, ...foreignFocusedAt],
        };
      }
      case 'rearrange': {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const columns = action.payload;
        const rows = extendParentCells(transformItems(state.items, columns));
        const foreignFocusedAt = state.foreignFocuses
          .map(focus => getForeignFocusedAt(rows, focus))
          // $FlowFixMe flow doesn't support flat()
          .flat();

        return {
          ...state,
          rows,
          focusedAt: null,
          weakFocusedAt: [],
          foreignFocusedAt,
        };
      }
      case 'change_value':
        if (!targetCell) {
          throw new Error('cell not found');
        }

        // TODO: update cell & original value

        return state;
      case 'focus': {
        if (!targetCell) {
          throw new Error('cell not found');
        }

        if (state.focusedAt !== null && state.focusedAt.cell === targetCell) {
          return state;
        }

        if (targetCell.empty) {
          return reducer(state, { type: 'blur' });
        }

        const weakFocusedAt = targetCell.duplicatable
          ? state.rows.reduce((positions, row, x) => {
              row.forEach((cell, y) => {
                if (
                  // $FlowFixMe nullable targetCell is already checked
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
          focusedAt: {
            ...action.cell,
            cell: targetCell,
          },
          weakFocusedAt,
        };
      }
      case 'blur': {
        return {
          ...state,
          focusedAt: null,
          weakFocusedAt: [],
        };
      }
      case 'focus_up': {
        if (!state.focusedAt) {
          return state;
        }

        return reducer(state, {
          type: 'focus',
          cell: getNextFocusable(state.focusedAt, pos => ({ ...pos, x: pos.x - 1 }), true),
        });
      }
      case 'focus_down': {
        if (!state.focusedAt) {
          return state;
        }

        return reducer(state, {
          type: 'focus',
          cell: getNextFocusable(state.focusedAt, pos => ({ ...pos, x: pos.x + 1 }), true),
        });
      }
      case 'focus_right': {
        if (!state.focusedAt) {
          return state;
        }

        return reducer(state, {
          type: 'focus',
          cell: getNextFocusable(state.focusedAt, pos => ({ ...pos, y: pos.y + 1 }), false),
        });
      }
      case 'focus_left': {
        if (!state.focusedAt) {
          return state;
        }

        return reducer(state, {
          type: 'focus',
          cell: getNextFocusable(state.focusedAt, pos => ({ ...pos, y: pos.y - 1 }), false),
        });
      }
      case 'foreign_focuses': {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const foreignFocusedAt = action.payload
          .map(focus => getForeignFocusedAt(state.rows, focus))
          // $FlowFixMe flow doesn't support flat()
          .flat();

        return {
          ...state,
          foreignFocuses: action.payload,
          foreignFocusedAt,
        };
      }
      case 'foreign_focus': {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const focus: Object = action.payload;
        const foreignFocusedAt = getForeignFocusedAt(state.rows, focus);

        return {
          ...state,
          foreignFocuses: [...state.foreignFocuses.filter(ff => ff.id === focus.id), focus],
          foreignFocusedAt: [
            ...state.foreignFocusedAt.filter(ff => ff.id !== focus.id),
            ...foreignFocusedAt,
          ],
        };
      }
      case 'foreign_blur': {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        return {
          ...state,
          // $FlowFixMe nullable action.payload is already checked
          foreignFocusedAt: state.foreignFocusedAt.filter(ff => ff.id !== action.payload.id),
        };
      }
      default:
        throw new Error('invalid dispatch action');
    }
  }

  return reducer;
}
