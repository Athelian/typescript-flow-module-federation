// @flow
import * as React from 'react';
import { VariableSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import LoadingIcon from 'components/LoadingIcon';
import type { SortDirection } from 'types';
import type { Area, CellData, ColumnState } from '../SheetState/types';
import Column from '../Column';
import {
  ColumnFillerStyle,
  ColumnsWrapperStyle,
  SheetWrapperStyle,
  GridStyle,
  InnerGridStyle,
} from './style';

type Props = {
  columns: Array<ColumnState>,
  data: Array<Array<CellData>>,
  rowCount: number,
  loading: boolean,
  loadingMore: boolean,
  hasMore: boolean,
  focusAt: Area | null,
  onColumnSort: (key: string, direction: SortDirection) => void,
  onThreshold: () => Promise<any>,
  onColumnResize: (key: string, width: number) => void,
  children: React.ComponentType<any>,
};

type InnerGridProps = {
  children: React.Node,
};

const GridColumnContext = React.createContext<{
  columns: Array<ColumnState>,
  onColumnSort: (key: string, direction: SortDirection) => void,
  onColumnResize: (key: string, width: number) => void,
}>({
  columns: [],
  onColumnSort: () => {},
  onColumnResize: () => {},
});

const InnerGrid = React.forwardRef(({ children, ...rest }: InnerGridProps, ref) => (
  <div ref={ref} {...rest} className={InnerGridStyle}>
    <GridColumnContext.Consumer>
      {({ columns, onColumnSort, onColumnResize }) => (
        <div className={ColumnsWrapperStyle}>
          {columns.map(column => (
            <Column
              key={column.key}
              title={column.title}
              sortable={!!column.sort}
              direction={column.sort?.direction}
              onSortToggle={() => {
                onColumnSort(
                  column.key,
                  column.sort?.direction === 'DESCENDING' ? 'ASCENDING' : 'DESCENDING'
                );
              }}
              color={column.color}
              width={column.width}
              minWidth={column.minWidth}
              onResize={width => onColumnResize(column.key, width)}
            />
          ))}
          {columns.length > 0 && (
            <div className={ColumnFillerStyle(columns[columns.length - 1].color)} />
          )}
        </div>
      )}
    </GridColumnContext.Consumer>

    {children}
  </div>
));

const SheetRenderer = ({
  columns,
  data,
  rowCount,
  loading,
  loadingMore,
  hasMore,
  focusAt,
  onColumnSort,
  onThreshold,
  onColumnResize,
  children,
}: Props) => {
  const gridRef = React.useRef(null);
  const setGridRef = React.useCallback(el => {
    gridRef.current = el;
  }, []);

  React.useEffect(() => {
    if (!gridRef.current || !focusAt) {
      return;
    }

    gridRef.current.scrollToItem({
      align: 'auto',
      rowIndex: focusAt.from.x,
      columnIndex: focusAt.from.y,
    });
  }, [focusAt]);

  React.useEffect(() => {
    if (!gridRef.current) {
      return;
    }

    // $FlowFixMe Annotate by VariableSizeGrid doesn't work
    gridRef.current.resetAfterColumnIndex(0);
  }, [columns]);

  const rowCountWithLoading = loadingMore ? rowCount + 1 : rowCount;

  return (
    <div className={SheetWrapperStyle}>
      {loading ? (
        <LoadingIcon />
      ) : (
        <AutoSizer>
          {({ height, width }) => (
            <InfiniteLoader
              isItemLoaded={index => index < rowCount || !hasMore}
              itemCount={rowCount + hasMore}
              loadMoreItems={() => {
                if (loading || loadingMore) {
                  return null;
                }

                return onThreshold();
              }}
            >
              {({ onItemsRendered, ref }) => {
                const itemsRendered = gridData => {
                  const { visibleRowStartIndex, visibleRowStopIndex } = gridData;

                  return onItemsRendered({
                    visibleStartIndex: visibleRowStartIndex,
                    visibleStopIndex: visibleRowStopIndex,
                  });
                };

                return (
                  <GridColumnContext.Provider value={{ columns, onColumnResize, onColumnSort }}>
                    {/* $FlowFixMe flow doesn't understand react-window typing for estimatedColumnWidth */}
                    <VariableSizeGrid
                      ref={r => {
                        ref(r);
                        setGridRef(r);
                      }}
                      className={GridStyle}
                      itemData={data}
                      width={width}
                      height={height}
                      columnCount={columns.length}
                      columnWidth={index => columns[index].width}
                      estimatedColumnWidth={200}
                      rowCount={rowCountWithLoading}
                      rowHeight={() => 30}
                      onItemsRendered={itemsRendered}
                      overscanRowCount={10}
                      innerElementType={InnerGrid}
                    >
                      {children}
                    </VariableSizeGrid>
                  </GridColumnContext.Provider>
                );
              }}
            </InfiniteLoader>
          )}
        </AutoSizer>
      )}
    </div>
  );
};

export default React.memo<Props>(SheetRenderer);
