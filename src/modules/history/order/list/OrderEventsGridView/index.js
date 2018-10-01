// @flow
import * as React from 'react';
import GridView from 'components/GridView';
import DefaultEvent from 'modules/history/components/DefaultEvent';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => <DefaultEvent key={item.id} event={item} />;

const defaultProps = {
  renderItem: defaultRenderItem,
};

const OrderEventsGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="1000px"
      isEmpty={items.length === 0}
      emptyMessage="No event history found"
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

OrderEventsGridView.defaultProps = defaultProps;

export default OrderEventsGridView;
