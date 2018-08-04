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
  renderComponent: React.Node,
  type: 'grid' | 'list' | 'table',
  columnCount?: number,
};

export default function InfiniteLoader({
  hasNextPage,
  isNextPageLoading,
  list,
  onLoadNextPage,
  renderComponent,
  type,
  columnCount = 3,
  ...rest
}: Props & RenderProps) {
  const rowCount = hasNextPage ? list.length + columnCount : list.length;
  const loadMoreRows = isNextPageLoading ? () => {} : onLoadNextPage;
  const isRowLoaded = ({ index }) => !hasNextPage || index < list.length;
  const RenderComponent = renderComponent;

  return (
    <BaseInfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={rowCount}>
      {({ onRowsRendered, registerChild }) =>
        (() => {
          if (type === 'list')
            return (
              <RenderComponent
                ref={registerChild}
                onRowsRendered={onRowsRendered}
                rowCount={rowCount}
                {...rest}
              />
            );

          if (type === 'table') {
            const { children, ...restProps } = rest;
            return (
              <RenderComponent
                ref={registerChild}
                onRowsRendered={onRowsRendered}
                rowCount={rowCount}
                {...restProps}
              >
                {children}
              </RenderComponent>
            );
          }

          return (
            <RenderComponent
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
              rowCount={rowCount}
              {...rest}
            />
          );
        })()
      }
    </BaseInfiniteLoader>
  );
}
