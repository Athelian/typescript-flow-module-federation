// @flow
import * as React from 'react';
import SheetState from '../SheetState';
import SheetRenderer from '../SheetRenderer';
import SheetLive from '../SheetLive';
import Cell from '../Cell';
import type { ColumnConfig } from '../SheetRenderer';
import type { CellValue } from '../SheetState';

type Props = {
  columns: Array<ColumnConfig>,
  items: Array<Object>,
  loading: boolean,
  hasMore: boolean,
  transformItem: Object => Array<Array<CellValue>>,
  onLoadMore: () => Promise<Array<Object>>,
};

const Sheet = ({ columns, items, loading, hasMore, transformItem, onLoadMore }: Props) => {
  return (
    <SheetState
      columns={columns}
      items={items}
      transformItem={transformItem}
      onLoadMore={onLoadMore}
    >
      {({
        rows,
        entities,
        focusedAt,
        weakFocusedAt,
        foreignFocusedAt,
        columns: columnsWithWidth,
        loadingMore,
        dispatch,
        handleColumnResize,
        handleThreshold,
      }) => {
        let focusedEntity = null;
        if (focusedAt) {
          const cell = rows[focusedAt.x][focusedAt.y];
          if (cell.entity) {
            focusedEntity = {
              id: cell.entity.id,
              type: cell.entity.type,
              field: cell.entity.field,
            };
          }
        }

        return (
          <>
            <SheetLive entities={entities} focusedAt={focusedEntity} dispatch={dispatch} />
            <SheetRenderer
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
                    focus={!!focusedAt && focusedAt.x === x && focusedAt.y === y}
                    weakFocus={!!weakFocusedAt.find(f => f.x === x && f.y === y)}
                    foreignFocuses={foreignFocusedAt
                      .filter(f => f.x === x && f.y === y)
                      .map(f => ({
                        id: f.id,
                        firstName: f.user.firstName,
                        lastName: f.user.lastName,
                      }))}
                    readonly={cell.readonly || false}
                    empty={cell.empty || false}
                    forbidden={cell.forbidden || false}
                    permitted // TODO: use hasPermission thing
                    onFirstRow={x === 0}
                    dispatch={action => dispatch({ ...action, cell: { x, y } })}
                  />
                );
              }}
            </SheetRenderer>
          </>
        );
      }}
    </SheetState>
  );
};

export default Sheet;
