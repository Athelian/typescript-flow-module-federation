// @flow
import * as React from 'react';
import type { CellConfig, ColumnConfig } from '../TableRenderer';
import { cellReducer } from './reducer';

export type CellValue = {
  columnKey: string,
  entity: {
    id: string,
    type: string,
    field: string,
    permissions: () => boolean,
    ownedBy: string,
  } | null,
  data: {
    value: any,
    path: string,
  } | null,
  empty: boolean,
  forbidden: boolean,
  duplicatable: boolean,
};

export type Position = {
  x: number,
  y: number,
};

export type State = {
  items: Array<Object>,
  rows: Array<Array<CellValue>>,
  focusedAt: Position | null,
  weakFocusedAt: Array<Position>,
};

export type Action = {
  type: string,
  cell?: Position,
  state?: any,
};

type RenderProps = {
  rows: Array<Array<CellConfig>>,
  focusedAt: Position | null,
  weakFocusedAt: Array<Position>,
  columns: Array<ColumnConfig>,
  loadingMore: boolean,
  dispatch: (action: Action) => void,
  handleThreshold: () => void,
  handleColumnResize: (string, number) => void,
};

type Props = {
  columns: Array<ColumnConfig>,
  items: Array<Object>,
  transformItem: Object => Array<Array<CellConfig>>,
  onLoadMore: () => Promise<Array<Object>>,
  children: RenderProps => React.Node,
};

const TableState = ({ columns, items, transformItem, onLoadMore, children }: Props) => {
  const [columnWidths, setColumnWidths] = React.useState<Array<{ width: number, key: string }>>([]);
  const [loadingMore, setLoadingMore] = React.useState<boolean>(false);

  const onColumnResize = (key: string, width: number) => {
    if (columnWidths.find(c => c.key === key)) {
      setColumnWidths(columnWidths.map(c => (c.key === key ? { ...c, width } : c)));
    } else {
      setColumnWidths([...columnWidths, { key, width }]);
    }
  };

  const [state, dispatch] = React.useReducer<State, Action>(cellReducer(transformItem), {
    items: [],
    rows: [],
    focusedAt: null,
    weakFocusedAt: [],
  });

  React.useEffect(() => {
    dispatch({
      type: 'init',
      state: {
        items,
        columns,
      },
    });
  }, [columns, items, items.length]);

  React.useEffect(() => {
    dispatch({
      type: 'rearrange',
      state: columns,
    });
  }, [columns]);

  const handleThreshold = () => {
    setLoadingMore(true);

    onLoadMore()
      .then(newItems =>
        dispatch({
          type: 'append',
          state: {
            items: newItems,
            columns,
          },
        })
      )
      .then(() => setLoadingMore(false));
  };

  return children({
    rows: state.rows,
    focusedAt: state.focusedAt,
    weakFocusedAt: state.weakFocusedAt,
    columns: columns.map(c => {
      const columnWidth = columnWidths.find(p => p.key === c.key);
      if (columnWidth) {
        return { ...c, width: columnWidth.width };
      }

      return c;
    }),
    loadingMore,
    dispatch,
    handleThreshold,
    handleColumnResize: onColumnResize,
  });
};

export default TableState;
