// @flow
import * as React from 'react';
import InfiniteLoader from 'components/InfiniteLoader';
import type { Props as InfiniteLoaderProps } from 'components/InfiniteLoader';
/* $FlowFixMe: not have flow type yet */
import { Grid } from 'react-virtualized';

type RenderRowProps = {
  columnIndex: number, // Horizontal (column) index of cell
  isScrolling: boolean, // The List is currently being scrolled
  isVisible: boolean, // This row is visible within the List (eg it is not an overscanned row)
  key: number, // Unique key within array of rendered rows
  parent: React.Ref<typeof Grid>, // Reference to the parent List (instance)
  rowIndex: number, // Vertical (row) index of cell
  style: Object, // Style object to be applied to row (to position it);
};

type Props = InfiniteLoaderProps & {
  height: number,
  width: number,
  rowHeight: number,
  columnCount: number,
  columnWidth: number | (({ index: number }) => number),
  cellRenderer: RenderRowProps => React.Node,
};

export default class GridView extends React.PureComponent<Props> {
  render() {
    const {
      columnCount,
      hasNextPage,
      onLoadNextPage,
      list,
      isNextPageLoading,
      ...rest
    } = this.props;
    return (
      <InfiniteLoader
        onLoadNextPage={onLoadNextPage}
        hasNextPage={hasNextPage}
        list={list}
        isNextPageLoading={isNextPageLoading}
      >
        {({ onRowsRendered, registerChild }) => (
          <Grid
            ref={registerChild}
            columnCount={columnCount}
            onSectionRendered={({
              columnStartIndex,
              columnStopIndex,
              rowStartIndex,
              rowStopIndex,
            }) => {
              const startIndex = rowStartIndex * columnCount + columnStartIndex;
              const stopIndex = rowStopIndex * columnCount + columnStopIndex;

              onRowsRendered({ startIndex, stopIndex });
            }}
            {...rest}
          />
        )}
      </InfiniteLoader>
    );
  }
}
