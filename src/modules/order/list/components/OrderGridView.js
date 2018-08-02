// @flow
import * as React from 'react';
import GridView from 'components/GridView';
import LoadingIcon from 'components/LoadingIcon';
import OrderItem from './OrderItem';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  totalColumns?: number,
};

function OrderGridView({ items, onLoadMore, isLoading, hasMore, totalColumns = 3 }: Props) {
  const isRowLoaded = ({ index }) => !hasMore || index < items.length;
  return (
    <GridView
      hasNextPage={hasMore}
      isNextPageLoading={isLoading}
      onLoadNextPage={onLoadMore}
      list={items}
      width={window.outerWidth}
      height={window.outerHeight}
      rowCount={Math.ceil(items.length / totalColumns)}
      rowHeight={150}
      columnWidth={200}
      columnCount={totalColumns}
      cellRenderer={({ key, columnIndex, rowIndex, style }) =>
        isRowLoaded({ index: rowIndex * totalColumns + columnIndex }) ? (
          <div key={key} style={style}>
            <h3>#{rowIndex * totalColumns + columnIndex}</h3>
            <OrderItem order={items[rowIndex * totalColumns + columnIndex]} key={key} />
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

OrderGridView.defaultProps = {
  totalColumns: 3,
};

export default OrderGridView;
