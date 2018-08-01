// @flow
import * as React from 'react';
import InfiniteLoaderWrapper from 'components/InfiniteLoaderWrapper';
import OrderItem from './OrderItem';

type Props = {
  items: Array<Object>,
  total?: number,
  onLoadMore?: Function,
};

function OrderListView({ items, onLoadMore, total = 10 }: Props) {
  const options = {
    isRowLoaded: index => items[index],
    loadMoreRows: onLoadMore,
    rowCount: total,
  };
  return (
    <InfiniteLoaderWrapper
      type="list"
      loaderOptions={options}
      renderOptions={{
        rowHeight: 200,
        height: window.innerHeight,
        rowCount: total,
      }}
      renderItem={({ key, index, style }) => (
        <div key={key} style={style}>
          <h3>#{index}</h3>
          <OrderItem order={items[index]} />
        </div>
      )}
    />
  );
}

OrderListView.defaultProps = {
  onLoadMore: () => {},
  total: 10,
};

export default OrderListView;
