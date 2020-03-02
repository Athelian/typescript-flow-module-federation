// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import loadMore from 'utils/loadMore';
import type { FilterBy, SortBy } from 'types';
import PartnerGridView from './PartnerGridView';
import { partnerListQuery } from './query';

type Props = {
  filterBy: FilterBy,
  sortBy: SortBy,
  perPage: number,
  page: number,
};

const partnerPath = 'viewer.user.organization.partners';

export default function PartnerList({ ...filtersAndSort }: Props) {
  return (
    <Query
      query={partnerListQuery}
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
        const partners = data?.viewer?.user?.organization?.partners?.nodes ?? [];
        const nextPage = (data?.viewer?.user?.organization?.partners?.page ?? 1) + 1;
        const totalPage = data?.viewer?.user?.organization?.partners?.totalPage ?? 1;
        const hasMore = nextPage <= totalPage;
        return (
          <PartnerGridView
            items={partners}
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, partnerPath)}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
}
