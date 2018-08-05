// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import OrderGridView from './components/OrderGridView';
import OrderListView from './components/OrderListView';
import OrderTableView from './components/OrderTableView';
import query from './query.graphql';

export type Props = {
  viewType: string,
  filter: {
    status: string,
  },
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
};

class OrderList extends React.PureComponent<Props> {
  loadMorePage = (clientData: { fetchMore: Function, data: ?Object }) => {
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
      <Query query={query} variables={{ page: 1, ...filtersAndSort }}>
        {({ loading, data, fetchMore, error }) => {
          const nextPage = getByPathWithDefault(1, 'viewer.orders.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'viewer.orders.totalPage', data);
          if (error) {
            return error.message;
          }

          if (loading) return <LoadingIcon />;

          if (viewType === 'list')
            return (
              <OrderListView
                onLoadMore={() => this.loadMorePage({ fetchMore, data })}
                hasMore={nextPage <= totalPage}
                isLoading={loading}
                items={getByPathWithDefault([], 'viewer.orders.nodes', data)}
              />
            );

          if (viewType === 'table')
            return (
              <OrderTableView
                onLoadMore={() => this.loadMorePage({ fetchMore, data })}
                hasMore={nextPage <= totalPage}
                isLoading={loading}
                items={getByPathWithDefault([], 'viewer.orders.nodes', data)}
              />
            );

          return (
            <OrderGridView
              onLoadMore={() => this.loadMorePage({ fetchMore, data })}
              hasMore={nextPage <= totalPage}
              isLoading={loading}
              items={getByPathWithDefault([], 'viewer.orders.nodes', data)}
            />
          );
        }}
      </Query>
    );
  }
}

export default OrderList;
