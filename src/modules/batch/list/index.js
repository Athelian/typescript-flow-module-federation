// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import BatchGridView from './BatchGridView';
import { batchListQuery } from './query';

type Props = {
  filterBy: {
    query: string,
    archived: boolean,
  },
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
  page: number,
};

const BatchList = ({ ...filtersAndSort }: Props) => {
  return (
    <Query query={batchListQuery} variables={filtersAndSort} fetchPolicy="network-only">
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }

        const nextPage = getByPathWithDefault(1, 'batches.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'batches.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <BatchGridView
            items={getByPathWithDefault([], 'batches.nodes', data)}
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'batches')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default BatchList;
