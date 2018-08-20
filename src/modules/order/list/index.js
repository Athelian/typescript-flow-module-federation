// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import OrderGridView from './components/OrderGridView';
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

class OrderList extends React.PureComponent<Props> {
  loadMore = (clientData: { fetchMore: Function, data: ?Object }) => {
    const { data, fetchMore } = clientData;
    if (!data) return;
    const nextPage = getByPathWithDefault(1, 'viewer.orders.page', data) + 1;
    const totalPage = getByPathWithDefault(1, 'viewer.orders.totalPage', data);
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
          getByPathWithDefault({}, 'viewer.orders.page', prevResult) + 1 !==
            getByPathWithDefault({}, 'viewer.orders.page', fetchMoreResult)
        ) {
          return prevResult;
        }

        if (getByPathWithDefault([], 'viewer.orders.nodes', fetchMoreResult).length === 0)
          return prevResult;

        return {
          viewer: {
            ...prevResult.viewer,
            orders: {
              ...prevResult.viewer.orders,
              ...getByPathWithDefault({}, 'viewer.orders', fetchMoreResult),
              nodes: [
                ...prevResult.viewer.orders.nodes,
                ...getByPathWithDefault([], 'viewer.orders.nodes', fetchMoreResult),
              ],
            },
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

          const nextPage = getByPathWithDefault(1, 'viewer.orders.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'viewer.orders.totalPage', data);
          const hasMore = nextPage <= totalPage;

          return (
            <OrderGridView
              items={getByPathWithDefault([], 'viewer.orders.nodes', data)}
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
