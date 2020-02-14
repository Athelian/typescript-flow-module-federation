// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import GridView from 'components/GridView';
import NotificationRow from 'modules/notifications/components/NotificationRow';

type Props = {
  items: Array<Object>,
  onLoadMore: Function,
  hasMore: boolean,
  isLoading: boolean,
};

const NotificationListView = (props: Props) => {
  const { items, onLoadMore, hasMore, isLoading } = props;
  const [ignoreList, setIgnoreList] = React.useState([]);

  return (
    <GridView
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      itemWidth="100%"
      padding="0px"
      rowGap="0px"
      isEmpty={items.length === 0}
      emptyMessage={
        <FormattedMessage
          id="modules.notifications.noItem"
          defaultMessage="No notifications found"
        />
      }
    >
      {items.map(item =>
        ignoreList.includes(item.id) ? null : (
          <NotificationRow
            key={item.id}
            notification={item}
            onRemove={id => {
              setIgnoreList([...ignoreList, id]);
            }}
          />
        )
      )}
    </GridView>
  );
};

export default NotificationListView;
