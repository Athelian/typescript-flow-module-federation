// @flow
import * as React from 'react';
import InfiniteLoaderWrapper from 'components/InfiniteLoaderWrapper';
import OrderItem from './OrderItem';

type Props = {
  items: Array<Object>,
  total?: number,
  onLoadMore?: Function,
};

function OrderGridView({ items, onLoadMore, total = 10 }: Props) {
  const totalColumns = 3;
  const options = {
    isRowLoaded: index => items[index],
    loadMoreRows: onLoadMore,
    rowCount: Math.ceil(total / totalColumns),
  };
  return (
    <InfiniteLoaderWrapper
      type="grid"
      loaderOptions={options}
      renderOptions={{
        width: window.outerWidth,
        height: window.outerHeight,
        columnWidth: window.outerWidth / totalColumns,
        rowCount: Math.ceil(total / totalColumns),
        rowHeight: 200,
        columnCount: totalColumns,
      }}
      renderItem={({ key, columnIndex, rowIndex, style }) => (
        <div key={key} style={style}>
          <h3>#{rowIndex * totalColumns + columnIndex}</h3>
          <OrderItem order={items[rowIndex * totalColumns + columnIndex]} key={key} />
        </div>
      )}
    />
  );
}

OrderGridView.defaultProps = {
  onLoadMore: () => {},
  total: 10,
};

export default OrderGridView;
