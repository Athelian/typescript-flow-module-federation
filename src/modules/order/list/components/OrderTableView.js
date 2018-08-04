// @flow
import * as React from 'react';
import {
  AutoSizer,
  /* $FlowFixMe: not have flow type yet */
} from 'react-virtualized';
import TableView from 'components/TableView';

type Props = {
  items: Array<Object>,
  hasMore: boolean,
  isLoading: boolean,
  onLoadMore: Function,
};

function OrderTableView({ items, onLoadMore, hasMore, isLoading }: Props) {
  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <TableView
          rowHeight={170}
          headerHeight={20}
          height={window.innerHeight - 50}
          width={width}
          hasNextPage={hasMore}
          isNextPageLoading={isLoading}
          onLoadNextPage={onLoadMore}
          list={items}
          rowGetter={({ index }) => items[index]}
          columns={[
            {
              label: 'PO',
              dataKey: 'PO',
              width: 100,
            },
          ]}
        />
      )}
    </AutoSizer>
  );
}

export default OrderTableView;
