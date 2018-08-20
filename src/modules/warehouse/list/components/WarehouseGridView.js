// @flow
import * as React from 'react';
import GridView from 'components/GridView';
import WarehouseCard from './WarehouseCard';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => <WarehouseCard key={item.id} warehouse={item} />;

const defaultProps = {
  renderItem: defaultRenderItem,
};

const WarehouseGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth={200}
      isEmpty={items.length === 0}
      emptyMessage="No warehouses found"
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

WarehouseGridView.defaultProps = defaultProps;

export default WarehouseGridView;
