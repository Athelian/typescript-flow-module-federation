// @flow
import * as React from 'react';
import { VariableSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import LoadingIcon from 'components/LoadingIcon';
import type { Area } from '../SheetState/types';
import type { ColumnConfig } from '../SheetColumns';
import Column from '../Column';
import {
  ColumnFillerStyle,
  ColumnsWrapperStyle,
  ContentStyle,
  GridStyle,
  WrapperStyle,
} from './style';

type Props = {
  columns: Array<ColumnConfig>,
  rowCount: number,
  loading: boolean,
  loadingMore: boolean,
  hasMore: boolean,
  focusAt: Area | null,
  onSortToggle: string => void,
  onThreshold: () => void,
  onColumnResize: (key: string, width: number) => void,
  children: React.ComponentType<any>,
};

const SheetRenderer = ({
  columns,
  rowCount,
  loading,
  loadingMore,
  hasMore,
  focusAt,
  onSortToggle,
  onThreshold,
  onColumnResize,
  children,
}: Props) => {
  const columnsRef = React.useRef(null);
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

  const handleScroll = ({ scrollLeft }: Object) => {
    if (columnsRef && columnsRef.current) {
      columnsRef.current.scrollLeft = scrollLeft;
    }
  };

  return (
    <div className={WrapperStyle}>
      <div ref={columnsRef} className={ColumnsWrapperStyle}>
        {columns.map(column => (
          <Column
            key={column.key}
            title={column.title}
            sortable={!!column.sort}
            direction={column.sort?.direction}
            secondary={column.sort?.secondary}
            onSortToggle={() => {
              onSortToggle(column.key);
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
      <div className={ContentStyle}>
        {loading ? (
          <LoadingIcon />
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <InfiniteLoader
                isItemLoaded={index => index < rowCount || !hasMore}
                itemCount={rowCount + hasMore}
                loadMoreItems={() => {
                  if (!loading && !loadingMore) {
                    onThreshold();
                  }
                }}
              >
                {({ onItemsRendered, ref }) => {
                  const itemsRendered = gridData => {
                    const {
                      visibleRowStartIndex,
                      visibleRowStopIndex,
                      visibleColumnStopIndex,
                      overscanRowStartIndex,
                      overscanRowStopIndex,
                      overscanColumnStopIndex,
                    } = gridData;

                    const endCol =
                      (loadingMore ? overscanColumnStopIndex : visibleColumnStopIndex) + 1;
                    const startRow = loadingMore ? overscanRowStartIndex : visibleRowStartIndex;
                    const endRow = loadingMore ? overscanRowStopIndex : visibleRowStopIndex;

                    const visibleStartIndex = startRow * endCol;
                    const visibleStopIndex = endRow * endCol;

                    return onItemsRendered({
                      visibleStartIndex,
                      visibleStopIndex,
                    });
                  };

                  return (
                    <VariableSizeGrid
                      ref={r => {
                        ref(r);
                        setGridRef(r);
                      }}
                      className={GridStyle}
                      width={width}
                      height={height}
                      columnCount={columns.length}
                      columnWidth={index => columns[index].width}
                      rowCount={rowCountWithLoading}
                      rowHeight={() => 30}
                      onScroll={handleScroll}
                      onItemsRendered={itemsRendered}
                      overscanRowCount={10}
                    >
                      {children}
                    </VariableSizeGrid>
                  );
                }}
              </InfiniteLoader>
            )}
          </AutoSizer>
        )}
      </div>
    </div>
  );
};

export default React.memo<Props>(SheetRenderer);
