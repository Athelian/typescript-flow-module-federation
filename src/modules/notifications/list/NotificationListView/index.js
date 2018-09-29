// @flow
import * as React from 'react';
import GridView from 'components/GridView';
import NotificationItem from 'modules/notifications/components/NotificationItem';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object) => React.Node,
};

const defaultRenderItem = (item: Object) => <NotificationItem key={item.id} notification={item} />;

const defaultProps = {
  renderItem: defaultRenderItem,
};

const NotificationListView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="860px"
      isEmpty={items.length === 0}
      emptyMessage="No notification found"
    >
      {items.map(item => renderItem(item))}
    </GridView>
  );
};

NotificationListView.defaultProps = defaultProps;

export default NotificationListView;
