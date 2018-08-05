// @flow
import * as React from 'react';
import InfiniteLoader from 'components/InfiniteLoader';
import type { Props as InfiniteLoaderProps } from 'components/InfiniteLoader';
/* $FlowFixMe: not have flow type yet */
import { List } from 'react-virtualized';

type RenderRowProps = {
  index: number, // Index of row
  isScrolling: boolean, // The List is currently being scrolled
  isVisible: boolean, // This row is visible within the List (eg it is not an overscanned row)
  key: number, // Unique key within array of rendered rows
  parent: React.Ref<typeof List>, // Reference to the parent List (instance)
  style: Object, // Style object to be applied to row (to position it);
};

type Props = InfiniteLoaderProps & {
  height: number,
  width: number,
  rowHeight: number,
  rowRenderer: RenderRowProps => React.Node,
};

export default class ListView extends React.PureComponent<Props> {
  render() {
    const { hasNextPage, onLoadNextPage, list, isNextPageLoading, ...rest } = this.props;
    const rowCount = hasNextPage ? list.length + 1 : list.length;
    return (
      <InfiniteLoader
        onLoadNextPage={onLoadNextPage}
        hasNextPage={hasNextPage}
        list={list}
        isNextPageLoading={isNextPageLoading}
      >
        {({ onRowsRendered, registerChild }) => (
          <List ref={registerChild} onRowsRendered={onRowsRendered} rowCount={rowCount} {...rest} />
        )}
      </InfiniteLoader>
    );
  }
}
