// @flow
import * as React from 'react';
import type { SortDirection } from 'types';
import {
  useSheetStateLoadMore,
  SheetState,
  useSheetState,
  useSheetKeyNavigation,
} from '../SheetState';
import type {
  CellData,
  CellValue,
  ColumnConfig,
  ColumnSort,
  ColumnState,
  Mutator,
} from '../SheetState/types';
import type { EntityEventHandlerFactory } from '../SheetLive/types';
import { Actions } from '../SheetState/constants';
import SheetRenderer from '../SheetRenderer';
import CellRenderer from '../CellRenderer';
import { SheetLiveID } from '../SheetLive';
import { useSheetLiveFocus } from '../SheetLive/focus';
import { useSheetLiveEntity } from '../SheetLive/entity';
import { SheetContentWrapperStyle } from './style';
import { isInArea } from './helpers';

type ImplProps = {
  loading: boolean,
  hasMore: boolean,
  onLoadMore: () => Promise<Array<Object>>,
  handleEntityEvent: ?EntityEventHandlerFactory,
};

type Props = {
  items: Array<Object>,
  columns: Array<ColumnConfig>,
  onLocalSort: (items: Array<Object>, sorts: Array<ColumnSort>) => Array<Object>,
  onRemoteSort: (sorts: Array<ColumnSort>) => void,
  transformItem: Object => Array<Array<CellValue>>,
  onMutate: Mutator,
} & ImplProps;

const SheetImpl = ({ loading, hasMore, onLoadMore, handleEntityEvent }: ImplProps) => {
  const [loadingMore, handleThreshold] = useSheetStateLoadMore(onLoadMore);
  const { state, dispatch, mutate } = useSheetState();
  useSheetKeyNavigation();
  useSheetLiveFocus();
  useSheetLiveEntity(handleEntityEvent);

  const columnStates = React.useMemo<Array<ColumnState>>(
    () =>
      state.columns.map(column => {
        // $FlowFixMe mendo
        let columnState: ColumnState = {
          ...column,
          sort: column.sort
            ? {
                ...column.sort,
                key: column.key,
              }
            : undefined,
        };

        const width = state.columnWidths[column.key];
        if (width) {
          columnState = { ...columnState, width };
        }

        if (column.sort) {
          const sort = state.columnSorts
            .filter(s => s.group === column.sort?.group)
            .find(s => s.key === column.key);
          if (sort) {
            columnState = {
              ...columnState,
              sort,
            };
          }
        }

        return columnState;
      }),
    [state.columns, state.columnSorts, state.columnWidths]
  );

  const data = React.useMemo<Array<Array<CellData>>>(
    () =>
      state.rows.map((row, rowIndex) =>
        row.map((cell: CellValue, columnIndex) => {
          let item = null;
          if (cell.data) {
            const itemIdx = parseFloat(cell.data.path.split('.')[0]);
            item = state.items[itemIdx];
          }

          let parentCell = cell;
          if (cell.merged) {
            parentCell = state.rows[cell.merged.from.x][cell.merged.from.y];
          }

          return {
            item,
            cell,
            parentCell,
            foreignUsers: state.foreignFocusesAt
              .filter(ff => isInArea(ff, columnIndex, rowIndex))
              .map(ff => ({
                id: ff.id,
                firstName: ff.user.firstName,
                lastName: ff.user.lastName,
              })),
            addedRow:
              state.addedRows.find(
                addedRow => addedRow.from.x === rowIndex && addedRow.from.y === columnIndex
              ) || null,
            removedRow:
              state.removedRows.find(
                removedRow => removedRow.from.x === rowIndex && removedRow.from.y === columnIndex
              ) || null,
            error:
              !!state.errorAt &&
              state.errorAt.messages.length > 0 &&
              isInArea(state.errorAt, columnIndex, rowIndex)
                ? state.errorAt
                : null,
            focused: !!state.focusAt && isInArea(state.focusAt, columnIndex, rowIndex),
            hovered: !!state.hoverAt && isInArea(state.hoverAt, columnIndex, rowIndex),
            weakFocused: !!state.weakFocusAt.find(f => isInArea(f, columnIndex, rowIndex)),
            weakErrored: !!state.weakErrorAt.find(e => isInArea(e, columnIndex, rowIndex)),
            dispatch,
            mutate,
          };
        })
      ),
    [
      state.rows,
      state.items,
      state.foreignFocusesAt,
      state.addedRows,
      state.removedRows,
      state.errorAt,
      state.focusAt,
      state.hoverAt,
      state.weakFocusAt,
      state.weakErrorAt,
      dispatch,
      mutate,
    ]
  );

  const handleMouseLeave = () => {
    dispatch({
      type: Actions.UNHOVER,
    });
  };

  const onColumnSort = (column: string, direction: SortDirection) => {
    dispatch({
      type: Actions.SORT_COLUMN,
      payload: {
        column,
        direction,
      },
    });
  };
  const onColumnResize = (column: string, width: number) => {
    dispatch({
      type: Actions.RESIZE_COLUMN,
      payload: {
        column,
        width,
      },
    });
  };

  return (
    <div className={SheetContentWrapperStyle} onMouseLeave={handleMouseLeave}>
      <SheetRenderer
        columns={columnStates}
        data={data}
        rowCount={state.rows.length}
        loading={loading}
        loadingMore={loadingMore}
        focusAt={state.focusAt}
        hasMore={hasMore}
        onColumnSort={onColumnSort}
        onThreshold={handleThreshold}
        onColumnResize={onColumnResize}
      >
        {CellRenderer}
      </SheetRenderer>
    </div>
  );
};

const Sheet = ({
  transformItem,
  onMutate,
  onLocalSort,
  onRemoteSort,
  columns,
  items,
  loading,
  hasMore,
  onLoadMore,
  handleEntityEvent,
}: Props) => (
  <SheetState
    items={items}
    columns={columns}
    transformItem={transformItem}
    onMutate={onMutate}
    onLocalSort={onLocalSort}
    onRemoteSort={onRemoteSort}
  >
    <SheetLiveID>
      <SheetImpl
        loading={loading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        handleEntityEvent={handleEntityEvent}
      />
    </SheetLiveID>
  </SheetState>
);

export default Sheet;
