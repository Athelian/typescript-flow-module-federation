// @flow
import * as React from 'react';
import OrderItem from '../OrderItem';
import { GridViewWrapperStyle } from './style';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

class OrderGridView extends React.PureComponent<Props> {
  render() {
    const { items, onLoadMore, hasMore, isLoading } = this.props;
    const a = { onLoadMore, hasMore, isLoading };
    console.log(a);
    return (
      <div className={GridViewWrapperStyle}>
        {items.map(item => (
          <OrderItem key={item.id} order={item} />
        ))}
      </div>
    );
  }
}

export default OrderGridView;
