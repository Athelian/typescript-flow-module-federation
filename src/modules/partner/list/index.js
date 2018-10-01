// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import loadMore from 'utils/loadMore';
import PartnerGridView from './PartnerGridView';
import query from './query';

type Props = {
  viewType: string,
  filter: {},
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
};

class PartnerList extends React.Component<Props> {
  constructor() {
    super();
    this.partnerPath = 'viewer.user.group.partners';
  }

  loadMore = (clientData: { fetchMore: Function, data: ?Object }) => {
    const { data, fetchMore } = clientData;
    if (!data) return;
    const nextPage = getByPathWithDefault(1, `${this.partnerPath}.page`, data) + 1;
    const totalPage = getByPathWithDefault(1, `${this.partnerPath}.totalPage`, data);
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

  partnerPath: string;

  render() {
    const { viewType, sort, ...filtersAndSort } = this.props;
    return (
      <Query
        query={query}
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

          const parsedData = getByPathWithDefault([], `${this.partnerPath}.nodes`, data).map(
            item => item.group
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
