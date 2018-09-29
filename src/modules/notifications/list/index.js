// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import NotificationListView from './NotificationListView';
import query from '../query';

type Props = {
  // viewType: string,
  perPage: number,
};

const NotificationList = ({ ...filtersAndSort }: Props) => (
  <Query
    query={query}
    variables={{
      page: 1,
      ...filtersAndSort,
    }}
    fetchPolicy="network-only"
  >
    {({
      loading,
      // data,
      fetchMore,
      error,
    }) => {
      if (error) {
        return error.message;
      }

      const data = {
        viewer: {
          notifications: {
            nodes: [
              {
                id: 1,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 2,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 3,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 4,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 5,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 6,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 7,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 8,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 9,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 10,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 11,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 12,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 13,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
            ],
            page: 1,
            totalPage: 2,
          },
        },
      };

      const nextPage = getByPathWithDefault(1, 'viewer.notifications.page', data) + 1;
      const totalPage = getByPathWithDefault(1, 'viewer.notifications.totalPage', data);
      const hasMore = nextPage <= totalPage;

      return (
        <NotificationListView
          items={getByPathWithDefault([], 'viewer.notifications.nodes', data)}
          onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'viewer.notifications')}
          hasMore={hasMore}
          isLoading={loading}
        />
      );
    }}
  </Query>
);

export default NotificationList;
