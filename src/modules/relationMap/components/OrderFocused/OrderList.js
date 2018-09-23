// @flow
import * as React from 'react';
import LoadingIcon from 'components/LoadingIcon';
import InfiniteScroll from 'react-infinite-scroller';
import { OrderListWrapperStyle, EmptyMessageStyle } from './style';

type OptionalProps = {
  isLoading: boolean,
  spacing: number,
};

type Props = OptionalProps & {
  isEmpty: boolean,
  emptyMessage: any,
  itemWidth: number,
  onLoadMore: Function,
  hasMore: boolean,
  orders: Array<Array<Object>>,
  render: (item: Object) => React.Node,
};

const defaultProps = {
  isLoading: false,
};

const OrderList = (props: Props) => {
  const {
    isLoading,
    isEmpty,
    emptyMessage,
    itemWidth,
    spacing,
    onLoadMore,
    hasMore,
    orders,
    render,
  } = props;
  if (isLoading) {
    return <LoadingIcon />;
  }

  if (isEmpty) {
    return <div className={EmptyMessageStyle}>{emptyMessage}</div>;
  }

  return (
    <InfiniteScroll
      className={OrderListWrapperStyle(itemWidth, spacing || 0)}
      loadMore={onLoadMore}
      hasMore={hasMore}
      loader={<LoadingIcon key="loading" />}
      threshold={500}
      useWindow={false}
    >
      {orders.map((order, index) => render({ order, index }))}
    </InfiniteScroll>
  );
};

OrderList.defaultProps = defaultProps;

export default OrderList;
