// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import OrderEventsGridView from './OrderEventsGridView';
import query from './query';

type Props = {
  perPage: number,
  id: string,
};

const OrderEventsList = ({ perPage, id }: Props) => (
  <Query
    query={query}
    variables={{
      id,
      perPage,
      page: 1,
    }}
    fetchPolicy="network-only"
  >
    {({ loading, data, fetchMore, error }) => {
      if (error) {
        return error.message;
      }

      const nextPage = getByPathWithDefault(1, 'order.timeline.events.page', data) + 1;
      const totalPage = getByPathWithDefault(1, 'order.timeline.events.totalPage', data);
      const hasMore = nextPage <= totalPage;

      return (
        <OrderEventsGridView
          items={getByPathWithDefault([], 'order.timeline.events.nodes', data)}
          onLoadMore={() => loadMore({ fetchMore, data }, {}, 'order.timeline.events')}
          hasMore={hasMore}
          isLoading={loading}
        />
      );
    }}
  </Query>
);

export default OrderEventsList;
