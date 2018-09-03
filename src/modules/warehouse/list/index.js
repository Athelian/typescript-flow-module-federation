// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import WarehouseGridView from './WarehouseGridView';
import query from './query.graphql';

type Props = {
  viewType: string,
  filter: {
    status: string,
  },
  perPage: number,
};

class WarehouseList extends React.Component<Props> {
  loadMore = (clientData: { fetchMore: Function, data: ?Object }) => {
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
        const { filter, perPage } = this.props;
        if (
          !isEquals({ filter, perPage }, filtersAndSort) ||
          getByPathWithDefault({}, 'viewer.warehouses.page', prevResult) + 1 !==
            getByPathWithDefault({}, 'viewer.warehouses.page', fetchMoreResult)
        ) {
          return prevResult;
        }

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
      <Query query={query} variables={{ page: 1, ...filtersAndSort }} fetchPolicy="network-only">
        {({ loading, data, fetchMore, error }) => {
          if (error) {
            return error.message;
          }

          const nextPage = getByPathWithDefault(1, 'viewer.warehouses.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'viewer.warehouses.totalPage', data);
          const hasMore = nextPage <= totalPage;

          return (
            <WarehouseGridView
              items={getByPathWithDefault([], 'viewer.warehouses.nodes', data)}
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

export default WarehouseList;
