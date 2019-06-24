// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import OrderItemGridView from './OrderItemGridView';
import { orderItemListQuery } from './query';

type Props = {
  filterBy: {
    query: string,
    archived: boolean,
  },
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
  page: number,
};

const OrderItemList = ({ ...filtersAndSort }: Props) => {
  return (
    <Query query={orderItemListQuery} variables={filtersAndSort} fetchPolicy="network-only">
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }

        const nextPage = getByPathWithDefault(1, 'orderItems.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'orderItems.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <OrderItemGridView
            items={getByPathWithDefault([], 'orderItems.nodes', data)}
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'orderItems')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default OrderItemList;
