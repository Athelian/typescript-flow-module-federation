// @flow
import { setIn } from 'utils/fp';
import type { Action, CellValue, State, Position, ForeignFocus } from './index';
import { Actions } from './contants';

function getEntities(rows: Array<Array<CellValue>>): Array<{ id: string, type: string }> {
  return Array.from(
    rows
      .map(row =>
        row
          .filter(cell => !!cell.entity)
          .map(cell => ({ id: cell?.entity?.id, type: cell?.entity?.type }))
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

function getForeignFocusedAt(focus: Object, rows: Array<Array<CellValue>>): Array<ForeignFocus> {
  return rows
    .reduce((positions, row, x) => {
      row.forEach((cell, y) => {
        if (
          cell.entity?.id === focus.entity.id &&
          cell.entity?.type === focus.entity.__typename &&
          cell.entity?.field === focus.field
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

function transformItems(
  from: number,
  items: Array<Object>,
  columns: Array<string>,
  transformer: (number, Object) => Array<Array<CellValue>>
): Array<Array<CellValue>> {
  return (
    items
      .map(
        (item: Object, idx: number) =>
          transformer(from + idx, item).map(row =>
            columns.map(column => row.find(cell => column === cell.columnKey))
          ),
        {}
      )
      // $FlowFixMe flow doesn't support flat()
      .flat()
  );
}

function getSafePosition(position: Position, rows: Array<Array<CellValue>>): Position {
  return {
    x: Math.max(0, Math.min(position.x, rows.length - 1)),
    y: Math.max(0, Math.min(position.y, rows[0].length - 1)),
  };
}

function getFocusableFromEmpty(from: Position, rows: Array<Array<CellValue>>): Position {
  let current = from;

  while (true) {
    current = getSafePosition({ x: current.x - 1, y: current.y }, rows);
    const cell = rows[current.x][current.y];

    if (!cell.empty) {
      break;
    }
  }

  return current;
}

function getNextFocusable(
  from: Position,
  getNext: Position => Position,
  skipEmpty: boolean,
  rows: Array<Array<CellValue>>
): Position {
  let current = from;

  while (true) {
    const next = getSafePosition(getNext(current), rows);
    if (current.x === next.x && current.y === next.y) {
      const cell = rows[current.x][current.y];
      if (cell.empty) {
        current = from;
      }

      break;
    }

    current = next;

    const cell = rows[current.x][current.y];

    if (!cell.empty) {
      break;
    } else if (cell.empty && !skipEmpty) {
      current = getFocusableFromEmpty(current, rows);
      break;
    }
  }

  return current;
}

export function cellReducer(transformer: (number, Object) => Array<Array<CellValue>>) {
  function reducer(state: State, action: Action) {
    let targetCell: CellValue | null = null;
    if (action.cell) {
      targetCell = state.rows[action.cell.x][action.cell.y];
    }

    switch (action.type) {
      case Actions.INIT: {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const { items, columns } = action.payload;
        const rows = extendParentCells(transformItems(0, items, columns, transformer));
        const entities = getEntities(rows);

        return {
          ...state,
          initialized: true,
          items,
          columns,
          rows,
          entities,
          focusedAt: null,
          weakFocusedAt: [],
          foreignFocuses: [],
          foreignFocusedAt: [],
          erroredAt: null,
          weakErroredAt: [],
          addedRows: [],
          removedRows: [],
        };
      }
      case Actions.APPEND: {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const items = action.payload;
        const rows = extendParentCells(
          transformItems(state.items.length, items, state.columns, transformer)
        );
        const entities = getEntities(rows);
        const foreignFocusedAt = state.foreignFocuses
          .map(focus => getForeignFocusedAt(focus, rows))
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
      case Actions.REARRANGE: {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const columns = action.payload;
        const rows = extendParentCells(transformItems(0, state.items, columns, transformer));
        const foreignFocusedAt = state.foreignFocuses
          .map(focus => getForeignFocusedAt(focus, rows))
          // $FlowFixMe flow doesn't support flat()
          .flat();

        return {
          ...state,
          columns,
          rows,
          focusedAt: null,
          weakFocusedAt: [],
          foreignFocusedAt,
          erroredAt: null,
          weakErroredAt: [],
        };
      }
      case Actions.CELL_UPDATE:
        if (!targetCell) {
          throw new Error('cell not found');
        }

        return reducer(
          {
            ...state,
            erroredAt: null,
            weakErroredAt: [],
          },
          {
            type: Actions.CHANGE_VALUES,
            payload: [
              {
                entity: targetCell.entity,
                value: action.payload,
              },
            ],
          }
        );
      case Actions.CHANGE_VALUES: {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const changes = action.payload;
        if (changes.length === 0) {
          return state;
        }

        const cellsToUpdate = changes
          .map(({ entity, value }) => {
            return {
              cells: state.rows
                .map(row =>
                  row.filter(cell => {
                    return (
                      !cell.empty &&
                      cell.data &&
                      cell.entity?.id === entity.id &&
                      cell.entity?.type === entity.type &&
                      cell.entity?.field === entity.field
                    );
                  })
                )
                // $FlowFixMe flow doesn't support flat()
                .flat(),
              value,
            };
          })
          .filter(change => change.cells.length > 0);

        const items = [...state.items];
        cellsToUpdate.forEach(({ cells, value }) => {
          cells.forEach(cell => {
            setIn(cell.data.path, value, items);
          });
        });

        return {
          ...state,
          items,
          rows: state.rows.map<Array<CellValue>>(row =>
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
        };
      }
      case Actions.REPLACE_ITEM: {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const { item, index } = action.payload;

        const items = [...state.items];
        items[index] = item;
        const rows = extendParentCells(transformItems(0, items, state.columns, transformer));
        const entities = getEntities(rows);

        const newState = {
          ...state,
          items,
          rows,
          entities,
        };

        if (newState.focusedAt) {
          return reducer(newState, {
            type: Actions.FOCUS,
            cell: getSafePosition(newState.focusedAt, newState.rows),
          });
        }

        return newState;
      }
      case Actions.DELETE_ITEM: {
        if (action.payload === undefined) {
          throw new Error('invalid dispatch payload');
        }

        const items = [...state.items];
        items.splice(action.payload, 1);

        const rows = extendParentCells(transformItems(0, items, state.columns, transformer));
        const entities = getEntities(rows);

        const newState = {
          ...state,
          items,
          rows,
          entities,
        };

        if (newState.focusedAt) {
          return reducer(newState, {
            type: Actions.FOCUS,
            cell: getSafePosition(newState.focusedAt, newState.rows),
          });
        }

        return newState;
      }
      case Actions.SET_ERRORS: {
        if (!targetCell) {
          throw new Error('cell not found');
        }

        if (!action.payload) {
          return {
            ...state,
            erroredAt: null,
            weakErroredAt: [],
          };
        }

        const weakErroredAt = targetCell.duplicatable
          ? state.rows.reduce((positions, row, x) => {
              row.forEach((cell, y) => {
                if (
                  targetCell?.entity &&
                  cell.entity &&
                  targetCell?.entity?.id === cell.entity?.id &&
                  targetCell?.entity?.type === cell.entity?.type &&
                  targetCell?.entity?.field === cell.entity?.field
                ) {
                  positions.push({ x, y });
                }
              });

              return positions;
            }, [])
          : [];

        return {
          ...state,
          erroredAt: {
            ...action.cell,
            messages: action.payload,
          },
          weakErroredAt,
        };
      }
      case Actions.FOCUS: {
        if (!targetCell) {
          throw new Error('cell not found');
        }

        if (state.focusedAt?.cell === targetCell) {
          return state;
        }

        if (targetCell.empty) {
          return reducer(state, { type: 'blur' });
        }

        const weakFocusedAt = targetCell.duplicatable
          ? state.rows.reduce((positions, row, x) => {
              row.forEach((cell, y) => {
                if (
                  targetCell?.entity &&
                  targetCell?.entity?.id === cell.entity?.id &&
                  targetCell?.entity?.type === cell.entity?.type &&
                  targetCell?.entity?.field === cell.entity?.field
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
      case Actions.BLUR: {
        return {
          ...state,
          focusedAt: null,
          weakFocusedAt: [],
        };
      }
      case Actions.FOCUS_UP: {
        if (!state.focusedAt) {
          return state;
        }

        return reducer(state, {
          type: Actions.FOCUS,
          cell: getNextFocusable(
            state.focusedAt,
            pos => ({ ...pos, x: pos.x - 1 }),
            true,
            state.rows
          ),
        });
      }
      case Actions.FOCUS_DOWN: {
        if (!state.focusedAt) {
          return state;
        }

        return reducer(state, {
          type: Actions.FOCUS,
          cell: getNextFocusable(
            state.focusedAt,
            pos => ({ ...pos, x: pos.x + 1 }),
            true,
            state.rows
          ),
        });
      }
      case Actions.FOCUS_RIGHT: {
        if (!state.focusedAt) {
          return state;
        }

        return reducer(state, {
          type: Actions.FOCUS,
          cell: getNextFocusable(
            state.focusedAt,
            pos => ({ ...pos, y: pos.y + 1 }),
            false,
            state.rows
          ),
        });
      }
      case Actions.FOCUS_LEFT: {
        if (!state.focusedAt) {
          return state;
        }

        return reducer(state, {
          type: Actions.FOCUS,
          cell: getNextFocusable(
            state.focusedAt,
            pos => ({ ...pos, y: pos.y - 1 }),
            false,
            state.rows
          ),
        });
      }
      case Actions.FOREIGN_FOCUSES: {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const foreignFocusedAt = action.payload
          .map(focus => getForeignFocusedAt(focus, state.rows))
          // $FlowFixMe flow doesn't support flat()
          .flat();

        return {
          ...state,
          foreignFocuses: action.payload,
          foreignFocusedAt,
        };
      }
      case Actions.FOREIGN_FOCUS: {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const focus: Object = action.payload;
        const foreignFocusedAt = getForeignFocusedAt(focus, state.rows);

        return {
          ...state,
          foreignFocuses: [...state.foreignFocuses.filter(ff => ff.id !== focus.id), focus],
          foreignFocusedAt: [
            ...state.foreignFocusedAt.filter(ff => ff.id !== focus.id),
            ...foreignFocusedAt,
          ],
        };
      }
      case Actions.FOREIGN_BLUR: {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const blur: Object = action.payload;

        return {
          ...state,
          foreignFocuses: [...state.foreignFocuses.filter(ff => ff.id !== blur.id)],
          foreignFocusedAt: [...state.foreignFocusedAt.filter(ff => ff.id !== blur.id)],
        };
      }
      case Actions.ADDED_ROWS_OF_ENTITY: {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const { entity, onAdd } = action.payload;

        let newState = state;

        onAdd(a => {
          newState = reducer(newState, a);
        }, newState.items);

        let start = -1;
        let end = -1;

        newState.rows.every((row, idx) => {
          const cell: ?CellValue = row.find(c => {
            console.log(
              c.entity,
              entity,
              c.entity?.id === entity.id && c.entity?.type === entity.type
            );
            return c.entity?.id === entity.id && c.entity?.type === entity.type;
          });
          if (!cell) {
            return true;
          }

          const removedRow = newState.removedRows.find(
            r => r.entity.id === entity.id && r.entity.type === entity.type
          );
          if (removedRow?.start === idx) {
            return true;
          }

          start = idx;
          end = start + (cell.extended || 0);

          return false;
        });

        if (start === -1) {
          return newState;
        }

        return {
          ...newState,
          addedRows: [
            ...newState.addedRows,
            {
              start,
              end,
              entity,
            },
          ],
        };
      }
      case Actions.CLEAR_ADDED_ROWS: {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const { id, type } = action.payload;

        return {
          ...state,
          // $FlowFixMe ???
          addedRows: state.addedRows.filter(
            row => row.entity.id !== id && row.entity.type !== type
          ),
        };
      }
      case Actions.REMOVED_ROWS_ENTITY: {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const { entity, onClear } = action.payload;

        let start = -1;
        let end = -1;

        state.rows.every((row, idx) => {
          const cell: ?CellValue = row.find(
            c => c.entity?.id === entity.id && c.entity?.type === entity.type
          );
          if (!cell) {
            return true;
          }

          start = idx;
          end = start + (cell.extended || 0);

          return false;
        });

        if (start === -1) {
          return state;
        }

        return {
          ...state,
          removedRows: [
            ...state.removedRows,
            {
              start,
              end,
              entity,
              onClear,
            },
          ],
        };
      }
      case Actions.CLEAR_REMOVED_ROWS: {
        if (!action.payload) {
          throw new Error('invalid dispatch payload');
        }

        const { id, type } = action.payload;
        const removedRow = state.removedRows.find(
          row => row.entity.id === id && row.entity.type === type
        );
        if (!removedRow) {
          return state;
        }

        let newState = state;

        removedRow.onClear(a => {
          newState = reducer(newState, a);
        }, newState.items);

        return {
          ...newState,
          // $FlowFixMe ???
          removedRows: state.removedRows.filter(
            row => row.entity.id !== id && row.entity.type !== type
          ),
        };
      }
      default:
        throw new Error('invalid dispatch action');
    }
  }

  return reducer;
}
