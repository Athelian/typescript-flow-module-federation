// @flow
import * as React from 'react';
import GridView from 'components/GridView';
import { OrderItemCard } from 'components/Cards';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => <OrderItemCard key={item.id} order={item} />;

const defaultProps = {
  renderItem: defaultRenderItem,
};

const OrderItemGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth={200}
      isEmpty={items.length === 0}
      emptyMessage="No order items found"
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

OrderItemGridView.defaultProps = defaultProps;

export default OrderItemGridView;
