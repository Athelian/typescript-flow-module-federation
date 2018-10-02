// @flow
import * as React from 'react';
import isSameDay from 'date-fns/isSameDay';
import GridView from 'components/GridView';
import EntityTimeline from 'modules/history/components/EntityTimeline';
import { getByPathWithDefault } from 'utils/fp';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: (item: Object, showDayHeader: boolean) => React.Node,
};

const defaultRenderItem = (item: Object, showDayHeader: boolean) => (
  <EntityTimeline
    entityType="Order"
    key={item.id}
    entry={item}
    entryType={getByPathWithDefault('EventChange', '__typename', item)}
    showDayHeader={showDayHeader}
  />
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const OrderEventsGridView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading, renderItem = defaultRenderItem } = props;

  return (
    <GridView
      isReverse
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="1000px"
      isEmpty={items.length === 0}
      emptyMessage="No event history found"
    >
      {items.map((item, index) =>
        renderItem(
          item,
          index === 0 || (index > 0 && !isSameDay(item.createdAt, items[index - 1].createdAt))
        )
      )}
    </GridView>
  );
};

OrderEventsGridView.defaultProps = defaultProps;

export default OrderEventsGridView;
