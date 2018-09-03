// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import OrderGridView from './OrderGridView';
import query from './query';

type Props = {
  viewType: string,
  filter: {
    query: string,
    status: string,
  },
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
};

class OrderList extends React.Component<Props> {
  loadMore = (clientData: { fetchMore: Function, data: ?Object }) => {
    const { data, fetchMore } = clientData;
    if (!data) return;
    const nextPage = getByPathWithDefault(1, 'orders.page', data) + 1;
    const totalPage = getByPathWithDefault(1, 'orders.totalPage', data);
    if (nextPage > totalPage) return;

    const { viewType, ...filtersAndSort } = this.props;

    fetchMore({
      variables: {
        page: nextPage,
        ...filtersAndSort,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        const { filter, sort, perPage } = this.props;
        if (
          !isEquals({ filter, sort, perPage }, filtersAndSort) ||
          getByPathWithDefault({}, 'orders.page', prevResult) + 1 !==
            getByPathWithDefault({}, 'orders.page', fetchMoreResult)
        ) {
          return prevResult;
        }

        if (getByPathWithDefault([], 'orders.nodes', fetchMoreResult).length === 0)
          return prevResult;

        return {
          orders: {
            ...prevResult.viewer.orders,
            ...getByPathWithDefault({}, 'orders', fetchMoreResult),
            nodes: [
              ...prevResult.viewer.orders.nodes,
              ...getByPathWithDefault([], 'orders.nodes', fetchMoreResult),
            ],
          },
        };
      },
    });
  };

  render() {
    const { viewType, ...filtersAndSort } = this.props;
    return (
      <Query query={query} variables={{ page: 1, ...filtersAndSort }} fetchPolicy="network-only">
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
              onLoadMore={() => this.loadMore({ fetchMore, data })}
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
