// @flow
import * as React from 'react';
import GridView from './GridView';
import OrderItem from './OrderItem';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

class OrderGridView extends React.PureComponent<Props> {
  render() {
    const { items, onLoadMore, hasMore, isLoading } = this.props;

    return (
      <GridView onLoadMore={onLoadMore} hasMore={hasMore} isLoading={isLoading} itemWidth={200}>
        {items.map(item => (
          <OrderItem key={item.id} order={item} />
        ))}
      </GridView>
    );
  }
}

export default OrderGridView;
