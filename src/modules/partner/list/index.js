// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import PartnerGridView from './PartnerGridView';
import { partnerListQuery } from './query';

type Props = {
  filterBy: {},
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
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
        const parsedData = getByPathWithDefault([], `${partnerPath}.nodes`, data).map(item => ({
          ...item.organization,
          code: item.code,
        }));
        const nextPage = getByPathWithDefault(1, `${partnerPath}.page`, data) + 1;
        const totalPage = getByPathWithDefault(1, `${partnerPath}.totalPage`, data);
        const hasMore = nextPage <= totalPage;
        return (
          <PartnerGridView
            items={parsedData}
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, partnerPath)}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
}
