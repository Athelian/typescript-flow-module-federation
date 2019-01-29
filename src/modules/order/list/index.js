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
};

class OrderList extends React.PureComponent<Props> {
  render() {
    const { viewType, ...filtersAndSort } = this.props;
    return (
      <Query
        query={orderListQuery}
        variables={{
          page: 1,
          ...filtersAndSort,
        }}
        fetchPolicy="network-only"
      >
        {({ loading, data, fetchMore, error, refetch }) => {
          if (error) {
            return error.message;
          }

          const nextPage = getByPathWithDefault(1, 'orders.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'orders.totalPage', data);
          const hasMore = nextPage <= totalPage;
          emitter.once('CHANGE_ORDER_STATUS', () => {
            // TODO: after the mutation, it's not ready on data yet
            refetch();
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
