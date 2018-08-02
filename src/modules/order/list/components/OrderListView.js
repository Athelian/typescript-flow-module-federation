// @flow
import * as React from 'react';
import ListView from 'components/ListView';
import LoadingIcon from 'components/LoadingIcon';
import OrderItem from './OrderItem';

type Props = {
  items: Array<Object>,
  hasMore: boolean,
  isLoading: boolean,
  onLoadMore: Function,
};

function OrderListView({ items, onLoadMore, hasMore, isLoading }: Props) {
  const isRowLoaded = ({ index }) => !hasMore || index < items.length;
  return (
    <ListView
      rowHeight={200}
      height={window.innerHeight}
      width={window.innerWidth}
      hasNextPage={hasMore}
      isNextPageLoading={isLoading}
      onLoadNextPage={onLoadMore}
      list={items}
      rowRenderer={({ key, index, style }) =>
        isRowLoaded({ index }) ? (
          <div key={key} style={style}>
            <h3>#{index}</h3>
            <OrderItem order={items[index]} />
          </div>
        ) : (
          <div key={key} style={style}>
            <LoadingIcon />
          </div>
        )
      }
    />
  );
}

export default OrderListView;
