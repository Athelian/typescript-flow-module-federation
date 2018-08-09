// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import WarehouseGridView from './components/WarehouseGridView';
import WarehouseListView from './components/WarehouseListView';
import WarehouseTableView from './components/WarehouseTableView';
import query from './query.graphql';

type Props = {
  viewType: string,
  filter: {
    status: string,
  },
  perPage: number,
};

class WarehouseList extends React.PureComponent<Props> {
  loadMorePage = (clientData: { fetchMore: Function, data: ?Object }) => {
    const { data, fetchMore } = clientData;
    if (!data) return;
    const nextPage = getByPathWithDefault(1, 'viewer.warehouses.page', data) + 1;
    const totalPage = getByPathWithDefault(1, 'viewer.warehouses.totalPage', data);
    if (nextPage > totalPage) return;

    const { viewType, ...filtersAndSort } = this.props;
    fetchMore({
      variables: {
        page: nextPage,
        ...filtersAndSort,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (getByPathWithDefault([], 'viewer.warehouses.nodes', fetchMoreResult).length === 0)
          return prevResult;

        return {
          viewer: {
            ...prevResult.viewer,
            warehouses: {
              ...prevResult.viewer.warehouses,
              ...getByPathWithDefault({}, 'viewer.warehouses', fetchMoreResult),
              nodes: [
                ...prevResult.viewer.warehouses.nodes,
                ...getByPathWithDefault([], 'viewer.warehouses.nodes', fetchMoreResult),
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
          const nextPage = getByPathWithDefault(1, 'viewer.warehouses.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'viewer.warehouses.totalPage', data);
          if (error) {
            return error.message;
          }

          if (loading) return <LoadingIcon />;

          if (viewType === 'list')
            return (
              <WarehouseListView
                onLoadMore={() => this.loadMorePage({ fetchMore, data })}
                hasMore={nextPage <= totalPage}
                isLoading={loading}
                items={getByPathWithDefault([], 'viewer.warehouses.nodes', data)}
              />
            );

          if (viewType === 'table')
            return (
              <WarehouseTableView
                onLoadMore={() => this.loadMorePage({ fetchMore, data })}
                hasMore={nextPage <= totalPage}
                isLoading={loading}
                items={getByPathWithDefault([], 'viewer.warehouses.nodes', data)}
              />
            );

          return (
            <WarehouseGridView
              onLoadMore={() => this.loadMorePage({ fetchMore, data })}
              hasMore={nextPage <= totalPage}
              isLoading={loading}
              items={getByPathWithDefault([], 'viewer.warehouses.nodes', data)}
            />
          );
        }}
      </Query>
    );
  }
}

export default WarehouseList;
