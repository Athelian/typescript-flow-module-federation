// @flow
import * as React from 'react';
import {
  AutoSizer,
  /* $FlowFixMe: not have flow type yet */
} from 'react-virtualized';
import GridView from 'components/GridView';
import LoadingIcon from 'components/LoadingIcon';
import OrderItem from './OrderItem';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

function totalColumns(width, columnWidth) {
  return parseInt(width / columnWidth, 10) || 1;
}

function OrderGridView({ items, onLoadMore, isLoading, hasMore }: Props) {
  const isRowLoaded = ({ index }) => !hasMore || index < items.length;
  const columnWidth = 200;
  return (
    <AutoSizer disableHeight>
      {({ width }) => (
        <GridView
          hasNextPage={hasMore}
          isNextPageLoading={isLoading}
          onLoadNextPage={onLoadMore}
          list={items}
          width={width}
          height={window.outerHeight - 50}
          rowCount={Math.ceil(items.length / totalColumns(width, columnWidth))}
          rowHeight={170}
          columnWidth={columnWidth}
          columnCount={totalColumns(width, columnWidth)}
          cellRenderer={({ key, isScrolling, columnIndex, rowIndex, style }) =>
            isRowLoaded({ index: rowIndex * totalColumns(width, columnWidth) + columnIndex }) ? (
              <div key={key} style={style}>
                <OrderItem
                  showPlaceHolder={isScrolling}
                  order={items[rowIndex * totalColumns(width, columnWidth) + columnIndex]}
                  key={key}
                />
              </div>
            ) : (
              <div key={key} style={style}>
                <LoadingIcon />
              </div>
            )
          }
        />
      )}
    </AutoSizer>
  );
}

export default OrderGridView;
