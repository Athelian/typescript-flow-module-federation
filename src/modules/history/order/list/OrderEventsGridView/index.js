// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import isSameDay from 'date-fns/isSameDay';
import GridView from 'components/GridView';
import EntityTimeline from 'modules/history/components/EntityTimeline';
import { getByPathWithDefault } from 'utils/fp';

type DefaultRenderItemProps = {
  item: Object,
  showDayHeader: boolean,
  hideAvatar: boolean,
  commentHandlers: Object,
};

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
  renderItem?: DefaultRenderItemProps => React.Node,
  onDelete: string => Promise<any>,
  onUpdate: Object => Promise<any>,
};

const defaultRenderItem = ({
  item,
  showDayHeader,
  hideAvatar,
  commentHandlers,
}: DefaultRenderItemProps) => (
  <EntityTimeline
    entityType="Order"
    key={item.id}
    entry={item}
    entryType={getByPathWithDefault('EventChange', '__typename', item)}
    showDayHeader={showDayHeader}
    commentHandlers={commentHandlers}
    hideAvatar={hideAvatar}
  />
);

const defaultProps = {
  renderItem: defaultRenderItem,
};

const OrderEventsGridView = (props: Props) => {
  const {
    items,
    onLoadMore,
    hasMore,
    isLoading,
    onUpdate,
    onDelete,
    renderItem = defaultRenderItem,
  } = props;

  return (
    <GridView
      isReverse
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="800px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage id="modules.Histories.noItem" defaultMessage="No logs found" />
      }
    >
      {items.reverse().map((item, index) =>
        renderItem({
          item,
          showDayHeader:
            index === 0 || (index > 0 && !isSameDay(item.createdAt, items[index - 1].createdAt)),
          hideAvatar:
            index > 0 &&
            // eslint-disable-next-line no-underscore-dangle
            items[index - 1].__typename === 'EventComment' &&
            items[index - 1].createdBy.id === item.createdBy.id &&
            isSameDay(items[index - 1].createdAt, item.createdAt),
          commentHandlers: {
            onUpdate,
            onDelete,
          },
        })
      )}
    </GridView>
  );
};

OrderEventsGridView.defaultProps = defaultProps;

export default OrderEventsGridView;
