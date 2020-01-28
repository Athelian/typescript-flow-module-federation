// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import NotificationListView from './NotificationListView';
import { notificationListQuery } from '../query';

const NotificationList = () => (
  <Query
    query={notificationListQuery}
    variables={{
      page: 1,
      perPage: 10,
    }}
    fetchPolicy="network-only"
  >
    {({ loading, data, fetchMore, error }) => {
      if (error) {
        return error.message;
      }

      const nextPage = getByPathWithDefault(1, 'viewer.notifications.page', data) + 1;
      const totalPage = getByPathWithDefault(1, 'viewer.notifications.totalPage', data);
      const hasMore = nextPage <= totalPage;

      return (
        <NotificationListView
          items={getByPathWithDefault([], 'viewer.notifications.nodes', data)}
          onLoadMore={() =>
            loadMore(
              { fetchMore, data },
              {
                page: 1,
                perPage: 10,
              },
              'viewer.notifications'
            )
          }
          hasMore={hasMore}
          isLoading={loading}
        />
      );
    }}
  </Query>
);

export default NotificationList;
