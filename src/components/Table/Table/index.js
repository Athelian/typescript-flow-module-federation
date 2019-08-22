// @flow
import * as React from 'react';
import TableState from '../TableState';
import TableRenderer from '../TableRenderer';
import type { CellConfig } from '../TableRenderer';
import Cell from '../Cell';

type Props = {
  columns: Array<ColumnConfig>,
  items: Array<Object>,
  loading: boolean,
  hasMore: boolean,
  transformItem: Object => Array<Array<CellConfig>>,
  onLoadMore: () => Promise<Array<Object>>,
};

const Table = ({ columns, items, loading, hasMore, transformItem, onLoadMore }: Props) => {
  return (
    <TableState
      columns={columns}
      items={items}
      transformItem={transformItem}
      onLoadMore={onLoadMore}
    >
      {({
        rows,
        focusedAt,
        weakFocusedAt,
        columns: columnsWithWidth,
        loadingMore,
        dispatch,
        handleColumnResize,
        handleThreshold,
      }) => (
        <TableRenderer
          columns={columnsWithWidth}
          rowCount={rows.length}
          loading={loading}
          loadingMore={loadingMore}
          focusedAt={focusedAt}
          dispatch={dispatch}
          hasMore={hasMore}
          onThreshold={handleThreshold}
          onColumnResize={handleColumnResize}
        >
          {({ x, y }) => {
            const cell = rows[x][y];

            return (
              <Cell
                value={cell.data ? cell.data.value : null}
                focus={focusedAt && focusedAt.x === x && focusedAt.y === y}
                weakFocus={!!weakFocusedAt.find(f => f.x === x && f.y === y)}
                readonly={cell.readonly}
                empty={cell.empty}
                forbidden={cell.forbidden}
                permitted // TODO: use hasPermission thing
                dispatch={action => dispatch({ ...action, cell: { x, y } })}
              />
            );
          }}
        </TableRenderer>
      )}
    </TableState>
  );
};

export default Table;
