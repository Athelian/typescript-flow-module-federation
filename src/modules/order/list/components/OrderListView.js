// @flow
import * as React from 'react';
import InfiniteLoaderWrapper from 'components/InfiniteLoaderWrapper';
import OrderItem from './OrderItem';

type Props = {
  items: Array<Object>,
  onLoadMore?: Function,
};

function OrderListView({ items, onLoadMore }: Props) {
  const options = {
    isRowLoaded: index => !!items[index],
    loadMoreRows: onLoadMore,
  };
  return (
    <InfiniteLoaderWrapper
      type="list"
      loaderOptions={options}
      renderOptions={{
        rowHeight: 200,
        height: window.innerHeight,
        rowCount: items.length,
      }}
      renderItem={({ key, index, style }) => (
        <div key={key} style={style}>
          <OrderItem order={items[index]} />
        </div>
      )}
    />
  );
}
OrderListView.defaultProps = {
  onLoadMore: () => {},
};

export default OrderListView;
