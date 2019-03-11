// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import WarehouseGridView from './WarehouseGridView';
import { warehouseListQuery } from './query';

type Props = {
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
};

class WarehouseList extends React.Component<Props> {
  render() {
    const { ...filtersAndSort } = this.props;
    return (
      <Query
        query={warehouseListQuery}
        variables={{
          page: 1,
          ...filtersAndSort,
        }}
        fetchPolicy="network-only"
      >
        {({ loading, data, fetchMore, error }) => {
          if (error) {
            return error.message;
          }
          const nextPage = getByPathWithDefault(1, 'warehouses.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'warehouses.totalPage', data);
          const hasMore = nextPage <= totalPage;

          return (
            <WarehouseGridView
              items={getByPathWithDefault([], 'warehouses.nodes', data)}
              onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'warehouses')}
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
