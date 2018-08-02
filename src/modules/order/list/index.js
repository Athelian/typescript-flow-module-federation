// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import OrderGridView from './components/OrderGridView';
import OrderListView from './components/OrderListView';
import query from './query.graphql';

type Props = {
  viewType: string,
  initPage?: number,
  perPage?: number,
};

class OrderList extends React.PureComponent<Props> {
  static defaultProps = {
    initPage: 1,
    perPage: 10,
  };

  loadMorePage = (clientData: { fetchMore: Function, data: ?Object }) => {
    const { data, fetchMore } = clientData;
    const nextPage = getByPathWithDefault(1, 'viewer.orders.page', data) + 1;
    const totalPage = getByPathWithDefault(1, 'viewer.orders.totalPage', data);
    if (nextPage > totalPage) return;

    const { perPage = 10 } = this.props;
    fetchMore({
      variables: {
        page: nextPage,
        perPage,
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
    const { viewType, initPage = 1, perPage = 10 } = this.props;
    return (
      <Query query={query} variables={{ page: initPage, perPage }}>
        {({ loading, data, fetchMore }) => {
          const nextPage = getByPathWithDefault(1, 'viewer.orders.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'viewer.orders.totalPage', data);
          if (viewType === 'list')
            return (
              <OrderListView
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
