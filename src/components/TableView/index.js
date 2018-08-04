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
    const { columns, ...rest } = this.props;
    return (
      <InfiniteLoader type="table" renderComponent={Table} {...rest}>
        {columns.map(item => (
          <Column key={item.dataKey} {...item} />
        ))}
      </InfiniteLoader>
    );
  }
}
