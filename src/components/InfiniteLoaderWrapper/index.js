// @flow
import * as React from 'react';
import {
  InfiniteLoader,
  List,
  Grid,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  /* $FlowFixMe: not have flow type yet */
} from 'react-virtualized';

type RenderItemProps = {
  key: number,
  index: number,
  rowIndex: number,
  columnIndex: number,
  style: Object,
  parent: Object,
};

type Props = {
  loaderOptions: {
    isRowLoaded: Function,
    loadMoreRows?: Function,
    rowCount: number,
  },
  renderOptions: {
    rowCount: number,
    rowHeight?: number,
    columnWidth?: number,
    columnCount?: number,
    width?: number,
    height?: number,
  },
  type: 'list' | 'grid' | 'table',
  renderItem: (item: RenderItemProps) => React.Node,
};

export default class InfiniteLoaderWrapper extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    const {
      type,
      renderOptions: { rowHeight = 50, columnWidth = 100 },
    } = props;
    this.cache =
      type === 'list'
        ? new CellMeasurerCache({
            fixedWidth: true,
            minHeight: rowHeight,
          })
        : new CellMeasurerCache({
            defaultWidth: columnWidth,
            minWidth: columnWidth,
            fixedHeight: true,
          });
  }

  cache: Object;

  render() {
    const { loaderOptions, type, renderOptions, renderItem } = this.props;
    return (
      <InfiniteLoader {...loaderOptions}>
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
            {({ width, height }) =>
              type === 'list' ? (
                <List
                  deferredMeasurementCache={this.cache}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  rowRenderer={item => (
                    <CellMeasurer
                      parent={item.parent}
                      cache={this.cache}
                      key={item.key}
                      columnIndex={0}
                      rowIndex={item.index}
                    >
                      {renderItem(item)}
                    </CellMeasurer>
                  )}
                  width={width}
                  height={height}
                  {...renderOptions}
                />
              ) : (
                <Grid
                  deferredMeasurementCache={this.cache}
                  cellRenderer={item => (
                    <CellMeasurer
                      parent={item.parent}
                      cache={this.cache}
                      key={item.key}
                      columnIndex={item.columnIndex}
                      rowIndex={item.rowIndex}
                    >
                      {renderItem(item)}
                    </CellMeasurer>
                  )}
                  width={width}
                  height={height}
                  {...renderOptions}
                />
              )
            }
          </AutoSizer>
        )}
      </InfiniteLoader>
    );
  }
}
