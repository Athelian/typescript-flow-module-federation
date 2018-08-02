// @flow
import * as React from 'react';
import {
  InfiniteLoader as BaseInfiniteLoader,
  /* $FlowFixMe: not have flow type yet */
} from 'react-virtualized';

export type Props = {
  /** Are there more items to load? (This information comes from the most recent API request.) */
  hasNextPage: boolean,
  /** Are we currently loading a page of items? (This may be an in-flight flag in your Redux store for example.) */
  isNextPageLoading: boolean,
  list: Array<Object>,
  onLoadNextPage: Function,
};

type RenderProps = {
  renderComponent: React.Node,
  type: 'grid' | 'list',
  totalColumns?: number,
};

export default function InfiniteLoader({
  hasNextPage,
  isNextPageLoading,
  list,
  onLoadNextPage,
  renderComponent,
  type,
  totalColumns = 3,
  ...rest
}: Props & RenderProps) {
  const rowCount = hasNextPage ? list.length + 1 : list.length;

  const loadMoreRows = isNextPageLoading ? () => {} : onLoadNextPage;

  const isRowLoaded = ({ index }) => !hasNextPage || index < list.length;

  const RenderComponent = renderComponent;
  return (
    <BaseInfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={rowCount}>
      {({ onRowsRendered, registerChild }) =>
        type === 'list' ? (
          <RenderComponent
            ref={registerChild}
            onRowsRendered={onRowsRendered}
            rowCount={rowCount}
            {...rest}
          />
        ) : (
          <RenderComponent
            ref={registerChild}
            onSectionRendered={({
              columnStartIndex,
              columnStopIndex,
              rowStartIndex,
              rowStopIndex,
            }) => {
              const startIndex = rowStartIndex * totalColumns + columnStartIndex;
              const stopIndex = rowStopIndex * totalColumns + columnStopIndex;

              onRowsRendered({ startIndex, stopIndex });
            }}
            rowCount={rowCount}
            {...rest}
          />
        )
      }
    </BaseInfiniteLoader>
  );
}
