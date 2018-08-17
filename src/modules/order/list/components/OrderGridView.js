// @flow
import * as React from 'react';
import GridView from './GridView';
import OrderItem from './OrderItem';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => <OrderItem key={item.id} order={item} />;

const defaultProps = {
  renderItem: defaultRenderItem,
};

const OrderGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth={200}
      isEmpty={items.length === 0}
      emptyMessage="No orders found"
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

OrderGridView.defaultProps = defaultProps;

export default OrderGridView;
