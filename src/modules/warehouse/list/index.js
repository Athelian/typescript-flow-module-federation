// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import apolloClient from 'apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import type { FilterBy, SortBy } from 'types';
import emitter from 'utils/emitter';
import WarehouseGridView from './WarehouseGridView';
import { warehouseListQuery } from './query';

type Props = {
  filterBy: FilterBy,
  sortBy: SortBy,
  page: number,
  perPage: number,
};

const WarehouseList = ({ ...queryVariables }: Props) => {
  React.useEffect(() => {
    emitter.once('CHANGE_WAREHOUSE_STATUS', () => {
      apolloClient.reFetchObservableQueries();
    });
  });

  return (
    <Query query={warehouseListQuery} variables={queryVariables} fetchPolicy="network-only">
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
            onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'warehouses')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default WarehouseList;
