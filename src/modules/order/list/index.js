// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import OrderGridView from './OrderGridView';
import query from './query';

type Props = {
  viewType: string,
  filter: {
    query: string,
    archived: boolean,
  },
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
};

const OrderList = ({ viewType, sort, ...filtersAndSort }: Props) => (
  <Query
    query={query}
    variables={{
      page: 1,
      sort: {
        [sort.field]: sort.direction,
      },
      ...filtersAndSort,
    }}
    fetchPolicy="network-only"
  >
    {({ loading, data, fetchMore, error }) => {
      if (error) {
        return error.message;
      }

      const nextPage = getByPathWithDefault(1, 'orders.page', data) + 1;
      const totalPage = getByPathWithDefault(1, 'orders.totalPage', data);
      const hasMore = nextPage <= totalPage;

      return (
        <OrderGridView
          items={getByPathWithDefault([], 'orders.nodes', data)}
          onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'orders')}
          hasMore={hasMore}
          isLoading={loading}
        />
      );
    }}
  </Query>
);

export default OrderList;
