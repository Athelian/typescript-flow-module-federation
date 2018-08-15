// @flow
import * as React from 'react';
import Measure from 'react-measure';
import ListView from 'components/ListView';
import LoadingIcon from 'components/LoadingIcon';
import OrderItem from './OrderItem';

type Props = {
  items: Array<Object>,
  hasMore: boolean,
  isLoading: boolean,
  onLoadMore: Function,
};

class OrderListView extends React.PureComponent<Props> {
  render() {
    const { items, onLoadMore, hasMore, isLoading } = this.props;
    const isRowLoaded = ({ index }) => !hasMore || index < items.length;
    return (
      <Measure bounds>
        {({ measureRef, contentRect }) => (
          <div ref={measureRef}>
            <ListView
              rowHeight={170}
              height={window.innerHeight - 50}
              width={contentRect.bounds.width}
              hasNextPage={hasMore}
              isNextPageLoading={isLoading}
              onLoadNextPage={onLoadMore}
              list={items}
              rowRenderer={({ key, index, style }) =>
                isRowLoaded({ index }) ? (
                  <div key={key} style={style}>
                    <OrderItem order={items[index]} width={contentRect.bounds.width} />
                  </div>
                ) : (
                  <div key={key} style={style}>
                    <LoadingIcon />
                  </div>
                )
              }
            />
          </div>
        )}
      </Measure>
    );
  }
}

export default OrderListView;
