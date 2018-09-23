// @flow
import * as React from 'react';
import LoadingIcon from 'components/LoadingIcon';
import InfiniteScroll from 'react-infinite-scroller';
import { EmptyMessageStyle } from '../style';

type OptionalProps = {
  isLoading: boolean,
};

type Props = OptionalProps & {
  isEmpty: boolean,
  emptyMessage: any,
  onLoadMore: Function,
  hasMore: boolean,
  items: Array<Object>,
  className: string,
  render: (item: Object) => React.Node,
};

const defaultProps = {
  isLoading: false,
};

const OrderList = (props: Props) => {
  const { isLoading, isEmpty, emptyMessage, onLoadMore, hasMore, items, render, className } = props;
  if (isLoading) {
    return <LoadingIcon />;
  }

  if (isEmpty) {
    return <div className={EmptyMessageStyle}>{emptyMessage}</div>;
  }

  return (
    <InfiniteScroll
      className={className}
      loadMore={onLoadMore}
      hasMore={hasMore}
      loader={<LoadingIcon key="loading" />}
      threshold={500}
      useWindow
    >
      {items.map((item, index) => render({ item, index }))}
    </InfiniteScroll>
  );
};

OrderList.defaultProps = defaultProps;

export default OrderList;
