// @flow
import * as React from 'react';
import { VariableSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import LoadingIcon from 'components/LoadingIcon';
import type { Area, CellData, ColumnState } from '../SheetState/types';
import Column from '../Column';
import {
  ColumnFillerStyle,
  ColumnsWrapperStyle,
  SheetWrapperStyle,
  StickiesWrapperStyle,
  StickyStyle,
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
  onThreshold: () => Promise<any>,
  children: React.ComponentType<any>,
};

type InnerGridProps = {|
  children: React.Node,
|};

const GridColumnContext = React.createContext<Array<ColumnState>>([]);

const StickiesRenderer = ({ columns }: { columns: Array<ColumnState> }) => {
  const stickies = React.useMemo(() => {
    const list = [];
    let width = 0;

    columns
      .slice()
      .reverse()
      .forEach(column => {
        width += column.width;

        if (column.sticky) {
          list.push({
            key: column.key,
            label: column.sticky,
            color: column.color,
            width,
          });

          width = 0;
        }
      });

    return list.slice().reverse();
  }, [columns]);

  return (
    <div className={StickiesWrapperStyle}>
      {stickies.map(sticky => (
        <div key={sticky.key} style={{ minWidth: `${sticky.width}px` }}>
          <div className={StickyStyle(sticky.color)}>{sticky.label}</div>
        </div>
      ))}
    </div>
  );
};

const InnerGrid = React.forwardRef(({ children, ...rest }: InnerGridProps, ref) => (
  <div ref={ref} {...rest} className={InnerGridStyle}>
    <GridColumnContext.Consumer>
      {columns => (
        <>
          <div className={ColumnsWrapperStyle}>
            {columns.map(column => (
              <Column
                key={column.key}
                title={column.title}
                sortable={!!column.sort}
                direction={column.sort?.direction}
                onSortToggle={column.sort?.onToggle}
                color={column.color}
                width={column.width}
                minWidth={column.minWidth}
                onResize={column.onResize}
                sticky={column.sticky}
              />
            ))}
            {columns.length > 0 && (
              <div className={ColumnFillerStyle(columns[columns.length - 1].color)} />
            )}
          </div>
          <StickiesRenderer columns={columns} />
        </>
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
  onThreshold,
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
              itemCount={rowCount + Number(!loadingMore && hasMore)}
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
                  <GridColumnContext.Provider value={columns}>
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
