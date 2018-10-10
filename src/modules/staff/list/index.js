// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import StaffGridView from './StaffGridView';
import { staffListQuery } from './query';

type Props = {
  viewType: string,
  filter: {},
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
};

const StaffList = ({ viewType, sort, ...filtersAndSort }: Props) => (
  <Query
    query={staffListQuery}
    variables={{
      page: 1,
      sort: {
        [sort.field]: sort.direction,
      },
      ...filtersAndSort,
    }}
    fetchPolicy="network-only"
  >
    {({ loading, data, fetchMore, error }) => {
      if (error) {
        return error.message;
      }

      const nextPage = getByPathWithDefault(1, 'users.page', data) + 1;
      const totalPage = getByPathWithDefault(1, 'users.totalPage', data);
      const hasMore = nextPage <= totalPage;

      return (
        <StaffGridView
          items={getByPathWithDefault([], 'users.nodes', data)}
          onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'users')}
          hasMore={hasMore}
          isLoading={loading}
        />
      );
    }}
  </Query>
);

export default StaffList;
