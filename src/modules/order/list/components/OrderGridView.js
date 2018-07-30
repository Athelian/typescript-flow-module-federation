// @flow
import * as React from 'react';
import InfiniteLoaderWrapper from 'components/InfiniteLoaderWrapper';
import OrderItem from './OrderItem';

type Props = {
  items: Array<Object>,
  onLoadMore?: Function,
};

function OrderGridView({ items, onLoadMore }: Props) {
  const totalColumns = 3;
  const options = {
    isRowLoaded: index => !!items[index],
    loadMoreRows: onLoadMore,
  };
  return (
    <InfiniteLoaderWrapper
      type="grid"
      loaderOptions={options}
      renderOptions={{
        width: window.outerWidth,
        height: window.outerHeight,
        columnWidth: window.outerWidth / totalColumns,
        rowCount: Math.ceil(items.length / totalColumns),
        rowHeight: 500,
        columnCount: totalColumns,
      }}
      renderItem={({ key, columnIndex, rowIndex, style }) => (
        <div key={key} style={style}>
          <OrderItem {...items[rowIndex * 3 + columnIndex]} key={key} />{' '}
        </div>
      )}
    />
  );
}

OrderGridView.defaultProps = {
  onLoadMore: () => {},
};

export default OrderGridView;
