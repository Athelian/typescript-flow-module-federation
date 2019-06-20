// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
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

class PartnerList extends React.Component<Props> {
  partnerPath = 'viewer.user.group.partners';

  loadMore = (clientData: { fetchMore: Function, data: ?Object }) => {
    const { data, fetchMore } = clientData;
    if (!data) return;
    const nextPage = getByPathWithDefault(1, `${this.partnerPath}.page`, data) + 1;
    const totalPage = getByPathWithDefault(1, `${this.partnerPath}.totalPage`, data);
    if (nextPage > totalPage) return;

    const { ...filtersAndSort } = this.props;

    fetchMore({
      variables: {
        page: nextPage,
        ...filtersAndSort,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        const { filterBy: filter, perPage } = this.props;
        if (
          !isEquals({ filter, perPage }, filtersAndSort) ||
          getByPathWithDefault({}, `${this.partnerPath}.page`, prevResult) + 1 !==
            getByPathWithDefault({}, `${this.partnerPath}.page`, fetchMoreResult)
        ) {
          return prevResult;
        }

        if (getByPathWithDefault([], `${this.partnerPath}.nodes`, fetchMoreResult).length === 0)
          return prevResult;

        return {
          viewer: {
            ...prevResult.viewer,
            group: {
              ...prevResult.viewer.group,
              partners: {
                ...prevResult.viewer.partners,
                ...getByPathWithDefault({}, this.partnerPath, fetchMoreResult),
                nodes: [
                  ...prevResult.viewer.partners.nodes,
                  ...getByPathWithDefault([], `${this.partnerPath}.nodes`, fetchMoreResult),
                ],
              },
            },
          },
        };
      },
    });
  };

  render() {
    const { ...filtersAndSort } = this.props;
    return (
      <Query
        key={JSON.stringify(filtersAndSort)}
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

          const parsedData = getByPathWithDefault([], `${this.partnerPath}.nodes`, data).map(
            item => ({ ...item.group, code: item.code })
          );
          const nextPage = getByPathWithDefault(1, `${this.partnerPath}.page`, data) + 1;
          const totalPage = getByPathWithDefault(1, `${this.partnerPath}.totalPage`, data);
          const hasMore = nextPage <= totalPage;
          return (
            <PartnerGridView
              items={parsedData}
              onLoadMore={() =>
                loadMore({ fetchMore, data }, filtersAndSort, `${this.partnerPath}`)
              }
              hasMore={hasMore}
              isLoading={loading}
            />
          );
        }}
      </Query>
    );
  }
}

export default PartnerList;
