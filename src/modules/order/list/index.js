// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import emitter from 'utils/emitter';
import OrderGridView from './OrderGridView';
import { orderListQuery } from './query';

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

class OrderList extends React.PureComponent<Props> {
  render() {
    const { viewType, sort, ...filtersAndSort } = this.props;

    return (
      <Query
        query={orderListQuery}
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

          emitter.once('CHANGE_ORDER_STATUS', () => {
            // TODO: after the mutation, it's not ready on data yet
            window.location.reload();
          });

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
  }
}

export default OrderList;
