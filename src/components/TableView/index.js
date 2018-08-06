// @flow
import * as React from 'react';
import InfiniteLoader from 'components/InfiniteLoader';
import type { Props as InfiniteLoaderProps } from 'components/InfiniteLoader';
/* $FlowFixMe: not have flow type yet */
import { Table, Column } from 'react-virtualized';

type Props = InfiniteLoaderProps & {
  height: number,
  width: number,
  headerHeight: number,
  rowHeight: number,
  rowGetter: ({ index: number }) => any,
  columns: Array<{
    label: string,
    dataKey: string,
    width: number,
  }>,
};

export default class TableView extends React.PureComponent<Props> {
  render() {
    const {
      hasNextPage,
      onLoadNextPage,
      list,
      isNextPageLoading,
      columns,
      rowGetter,
      ...rest
    } = this.props;
    const rowCount = hasNextPage ? list.length + 1 : list.length;
    return (
      <InfiniteLoader
        onLoadNextPage={onLoadNextPage}
        hasNextPage={hasNextPage}
        list={list}
        isNextPageLoading={isNextPageLoading}
      >
        {({ onRowsRendered, registerChild }) => (
          <Table
            ref={registerChild}
            onRowsRendered={onRowsRendered}
            rowCount={rowCount}
            rowGetter={rowGetter}
            {...rest}
          >
            {columns.map(item => (
              <Column key={item.dataKey} {...item} />
            ))}
          </Table>
        )}
      </InfiniteLoader>
    );
  }
}
