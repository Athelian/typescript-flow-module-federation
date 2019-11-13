// @flow
import type { SortDirection } from 'types';
import type { CellValue, ColumnConfig, State, ColumnSort } from 'components/Sheet/SheetState/types';
import { setForeignFocuses } from './foreign-focus';
import { reFocus } from './focus';
import { reError } from './error';

function computeMergedCells(
  rows: Array<Array<CellValue>>,
  offset: number = 0
): Array<Array<CellValue>> {
  const mergedCells = rows.reduce((list, row, x) => {
    row.forEach((cell, y) => {
      if (!cell.parent) {
        return;
      }

      let toX = x;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (rows.length <= toX + 1) {
          break;
        }

        const bottomCell = rows[toX + 1][y];
        if (!bottomCell.empty) {
          break;
        }

        toX += 1;
      }

      list.push({
        from: { x, y },
        to: { x: toX, y },
      });
    });

    return list;
  }, []);

  return rows.map((row, x) => {
    return row.map((cell, y) => {
      const merged = mergedCells.find(
        m => m.from.x <= x && m.to.x >= x && m.from.y <= y && m.to.y >= y
      );
      if (!merged) {
        return cell;
      }

      return {
        ...cell,
        merged: {
          from: { ...merged.from, x: merged.from.x + offset },
          to: { ...merged.to, x: merged.to.x + offset },
        },
      };
    });
  });
}

function transformItems(transformer: (number, Object) => Array<Array<CellValue>>) {
  return (from: number, items: Array<Object>): Array<Array<CellValue>> =>
    items
      .map((item: Object, idx: number) => transformer(from + idx, item))
      // $FlowFixMe flow doesn't support flat()
      .flat();
}

function mapRowsToColumns(
  rows: Array<Array<CellValue>>,
  columns: Array<string>
): Array<Array<CellValue>> {
  return rows.map(row =>
    columns.map(
      column =>
        row.find(cell => column === cell.columnKey) || {
          columnKey: column,
          entity: null,
          data: null,
          type: '',
        }
    )
  );
}

function resolveEntities(rows: Array<Array<CellValue>>): Array<{ id: string, type: string }> {
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

export function init(
  transformer: (number, Object) => Array<Array<CellValue>>,
  sorter: (Array<Object>, Array<ColumnSort>) => Array<Object>
) {
  return (state: State, payload: { items: Array<Object> }): State => {
    const { items } = payload;
    const sortedItems = sorter(items, state.columnSorts);
    const allRows = transformItems(transformer)(0, sortedItems);
    const rows = computeMergedCells(
      mapRowsToColumns(
        allRows,
        state.columns.map(c => c.key)
      )
    );
    const entities = resolveEntities(rows);

    return {
      ...state,
      initialized: true,
      items: sortedItems,
      rows,
      allRows,
      entities,
      hoverAt: null,
      focusAt: null,
      weakFocusAt: [],
      foreignFocuses: [],
      foreignFocusesAt: [],
      errorAt: null,
      weakErrorAt: [],
      addedRows: [],
      removedRows: [],
    };
  };
}

export function refresh(
  transformer: (number, Object) => Array<Array<CellValue>>,
  sorter: (Array<Object>, Array<ColumnSort>) => Array<Object>
) {
  return (state: State, payload: { items: Array<Object> }): State => {
    let newState = init(transformer, sorter)(state, payload);

    if (state.foreignFocuses.length > 0) {
      newState = setForeignFocuses(newState, {
        foreignFocuses: state.foreignFocuses,
      });
    }

    if (state.focusAt) {
      newState = reFocus(newState, {
        cell: state.focusAt.cell,
      });
    }

    if (state.errorAt) {
      newState = reError(newState, state.errorAt);
    }

    return {
      ...newState,
      addedRows: state.addedRows,
      removedRows: state.removedRows,
    };
  };
}

export function append(
  transformer: (number, Object) => Array<Array<CellValue>>,
  sorter: (Array<Object>, Array<ColumnSort>) => Array<Object>
) {
  return (state: State, payload: { items: Array<Object> }): State => {
    const { items } = payload;

    const sortedItems = sorter(items, state.columnSorts);
    const allRows = transformItems(transformer)(state.items.length, sortedItems);
    const rows = computeMergedCells(
      mapRowsToColumns(
        allRows,
        state.columns.map(c => c.key)
      ),
      state.rows.length
    );
    const entities = resolveEntities(rows);

    return setForeignFocuses(
      {
        ...state,
        items: [...state.items, ...sortedItems],
        rows: [...state.rows, ...rows],
        allRows: [...state.allRows, ...allRows],
        entities: [...state.entities, ...entities],
      },
      {
        foreignFocuses: state.foreignFocuses,
      }
    );
  };
}

export function rearrangeColumns(
  transformer: (number, Object) => Array<Array<CellValue>>,
  sorter: (Array<Object>, Array<ColumnSort>) => Array<Object>
) {
  return (state: State, payload: { columns: Array<ColumnConfig> }): State => {
    const { columns } = payload;

    const columnSorts = state.columnSorts.filter(s => !!columns.find(c => c.key === s.key));

    const sortGroups = new Set(columnSorts.map(s => s.group));
    const columnGroups = new Set(columns.filter(c => !!c.sort).map(c => c.sort?.group));
    if (sortGroups.size !== columnGroups.size) {
      sortGroups.forEach(g => columnGroups.delete(g));

      columnGroups.forEach(g => {
        const defaultColumn = columns.find(c => c.sort?.group === g && c.sort?.default);
        if (defaultColumn && defaultColumn.sort) {
          columnSorts.push({
            ...defaultColumn.sort,
            key: defaultColumn.key,
            direction: 'DESCENDING',
          });
          return;
        }

        const firstColumn = columns.find(c => c.sort?.group === g);
        if (firstColumn && firstColumn.sort) {
          columnSorts.push({ ...firstColumn.sort, key: firstColumn.key, direction: 'DESCENDING' });
        }
      });
    }

    return refresh(transformer, sorter)({ ...state, columns, columnSorts }, { items: state.items });
  };
}

export function resizeColumn(state: State, payload: { column: string, width: number }): State {
  const { column, width } = payload;

  return {
    ...state,
    columnWidths: {
      ...state.columnWidths,
      [column]: width,
    },
  };
}

export function sortColumn(
  transformer: (number, Object) => Array<Array<CellValue>>,
  sorter: (Array<Object>, Array<ColumnSort>) => Array<Object>
) {
  return (state: State, payload: { column: string, direction: SortDirection }): State => {
    const { column, direction } = payload;

    const columnConfig = state.columns.find(c => c.key === column);
    if (!columnConfig || !columnConfig.sort) {
      return state;
    }
    const { sort } = columnConfig;

    const columnSorts = [
      ...state.columnSorts.filter(s => s.group !== sort.group),
      {
        ...sort,
        key: columnConfig.key,
        direction,
      },
    ];

    return refresh(transformer, sorter)(
      { ...state, columnSorts },
      { items: sorter(state.items, columnSorts) }
    );
  };
}
