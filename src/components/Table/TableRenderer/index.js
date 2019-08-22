// @flow
import * as React from 'react';
import { VariableSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import type { Action, Position } from '../TableState';
import Column from '../Column';
import { ColumnsWrapperStyle, ContentStyle, WrapperStyle } from './style';

export type ColumnConfig = {
  key: string,
  title: any,
  width: number,
  hidden: boolean,
};

type Props = {
  columns: Array<ColumnConfig>,
  rowCount: Array<Array<Object>>,
  loading: boolean,
  loadingMore: boolean,
  hasMore: boolean,
  focusedAt: Position | null,
  onThreshold: () => void,
  onColumnResize: (key: string, width: number) => void,
  dispatch: (action: Action) => void,
  children: ({ cell: Object, x: number, y: number }) => React.Node,
};

const TableRenderer = ({
  columns,
  rowCount,
  loading,
  loadingMore,
  hasMore,
  focusedAt,
  onThreshold,
  onColumnResize,
  dispatch,
  children,
}: Props) => {
  const columnsRef = React.useRef(null);
  const gridRef = React.useRef(null);

  React.useEffect(() => {
    if (!gridRef.current || !focusedAt) {
      return;
    }

    // eslint-disable-next-line no-underscore-dangle
    gridRef.current._listRef.scrollToItem({
      rowIndex: focusedAt.x,
      columnIndex: focusedAt.y,
    });
  }, [focusedAt]);

  React.useEffect(() => {
    if (!gridRef.current) {
      return;
    }

    // eslint-disable-next-line no-underscore-dangle
    gridRef.current._listRef.resetAfterColumnIndex(0);
  }, [columns]);

  const rowCountWithLoading = loadingMore ? rowCount + 1 : rowCount;

  const handleScroll = ({ scrollLeft }: Object) => {
    if (columnsRef && columnsRef.current) {
      columnsRef.current.scrollLeft = scrollLeft;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp': {
        dispatch({
          type: 'focus_up',
        });
        return;
      }
      case 'ArrowDown': {
        dispatch({
          type: 'focus_down',
        });
        break;
      }
      case 'ArrowRight': {
        dispatch({
          type: 'focus_right',
        });
        break;
      }
      case 'ArrowLeft': {
        dispatch({
          type: 'focus_left',
        });
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className={WrapperStyle}>
      <div ref={columnsRef} className={ColumnsWrapperStyle}>
        {columns.map(column => (
          <Column
            key={column.key}
            title={column.title}
            width={column.width}
            onResize={width => onColumnResize(column.key, width)}
          />
        ))}
      </div>
      <div className={ContentStyle} role="presentation" tabIndex="-1" onKeyDown={handleKeyDown}>
        {loading ? (
          'loading'
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <InfiniteLoader
                ref={gridRef}
                isItemLoaded={index => index < rowCount || !hasMore}
                itemCount={hasMore ? rowCount * 100 : rowCount}
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
                      ref={ref}
                      width={width}
                      height={height}
                      columnCount={columns.length}
                      columnWidth={index => columns[index].width}
                      rowCount={rowCountWithLoading}
                      rowHeight={() => 40}
                      onScroll={handleScroll}
                      onItemsRendered={itemsRendered}
                      overscanRowCount={20}
                    >
                      {({ style, columnIndex, rowIndex }) => {
                        if (rowIndex >= rowCount) {
                          return 'loading';
                        }

                        return (
                          <div style={style}>
                            {children({
                              x: rowIndex,
                              y: columnIndex,
                            })}
                          </div>
                        );
                      }}
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

export default TableRenderer;
