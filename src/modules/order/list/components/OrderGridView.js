// @flow
import * as React from 'react';
import InfiniteLoaderWrapper from 'components/InfiniteLoaderWrapper';
import OrderItem from './OrderItem';

type Props = {
  items: Array<Object>,
  onLoadMore?: Function,
};

function OrderGridView({ items, onLoadMore }: Props) {
  const options = {
    isRowLoaded: index => !!items[index],
    loadMoreRows: onLoadMore,
    rowCount: 1000,
  };
  return (
    <InfiniteLoaderWrapper
      type="list"
      total={items.length}
      loaderOptions={options}
      listOptions={{ width: window.outerWidth, height: window.outerHeight, rowHeight: 100 }}
      renderItem={({ key, index }) => <OrderItem {...items[index]} key={key} />}
    />
  );
}

OrderGridView.defaultProps = {
  onLoadMore: () => {},
};

export default OrderGridView;
