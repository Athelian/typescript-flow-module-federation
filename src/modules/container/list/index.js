// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import type { FilterBy, SortBy } from 'types';
import ContainerGridView from './ContainerGridView';
import { containerListQuery } from './query';

type Props = {
  filterBy: FilterBy,
  sortBy: SortBy,
  perPage: number,
  page: number,
};

const ContainerList = ({ ...filtersAndSort }: Props) => {
  return (
    <Query query={containerListQuery} variables={filtersAndSort} fetchPolicy="network-only">
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        const nextPage = getByPathWithDefault(1, 'containers.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'containers.totalPage', data);
        const items = getByPathWithDefault([], 'containers.nodes', data);
        const hasMore = nextPage <= totalPage;
        return (
          <ContainerGridView
            items={items}
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'containers')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default ContainerList;
