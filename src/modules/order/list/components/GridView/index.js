// @flow
import * as React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingIcon from 'components/LoadingIcon';
import OrderItem from '../OrderItem';
import { GridViewWrapperStyle } from './style';

type Props = {
  items: Array<Object>,
  loadMore: Function,
  hasMore: boolean,
};

class OrderGridView extends React.PureComponent<Props> {
  render() {
    const { items, loadMore, hasMore } = this.props;

    return (
      <InfiniteScroll
        className={GridViewWrapperStyle}
        loadMore={loadMore}
        hasMore={hasMore}
        loader={<LoadingIcon key="loading" />}
        threshold={500}
        useWindow={false}
      >
        {items.map(item => (
          <OrderItem key={item.id} order={item} />
        ))}
      </InfiniteScroll>
    );
  }
}

export default OrderGridView;
