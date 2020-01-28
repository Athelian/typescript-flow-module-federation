// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import loadMore from 'utils/loadMore';
import NotificationListView from './NotificationListView';
import { notificationListQuery } from '../query';

type Props = {
  filterBy: Object,
};

const NotificationList = ({ filterBy }: Props) => (
  <Query
    query={notificationListQuery}
    variables={{
      page: 1,
      perPage: 10,
      // TODO: need API, send notification to API
      filterBy,
    }}
    fetchPolicy="network-only"
  >
    {({ loading, data, fetchMore, error }) => {
      if (error) {
        return error.message;
      }

      const nextPage = (data?.viewer?.notifications?.page ?? 1) + 1;
      const totalPage = data?.viewer?.notifications?.totalPage ?? 1;
      const hasMore = nextPage <= totalPage;

      return (
        <NotificationListView
          items={data?.viewer?.notifications?.nodes ?? []}
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
