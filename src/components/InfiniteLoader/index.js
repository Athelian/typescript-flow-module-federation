// @flow
import * as React from 'react';
import {
  InfiniteLoader as BaseInfiniteLoader,
  /* $FlowFixMe: not have flow type yet */
} from 'react-virtualized';

export type Props = {
  hasNextPage: boolean,
  isNextPageLoading: boolean,
  list: Array<Object>,
  onLoadNextPage: Function,
};

type RenderProps = {
  children: (renderProps: { onRowsRendered: Function, registerChild: Function }) => React.Node,
};

export default function InfiniteLoader({
  hasNextPage,
  isNextPageLoading,
  list,
  onLoadNextPage,
  children,
}: Props & RenderProps) {
  const rowCount = hasNextPage ? list.length + 1 : list.length;
  const loadMoreRows = isNextPageLoading ? () => {} : onLoadNextPage;
  const isRowLoaded = ({ index }) => !hasNextPage || index < list.length;

  return (
    <BaseInfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={rowCount}>
      {children}
    </BaseInfiniteLoader>
  );
}
