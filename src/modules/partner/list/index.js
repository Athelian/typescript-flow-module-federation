// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import PartnerGridView from './components/PartnerGridView';
import query from './query.graphql';

type Props = {
  viewType: string,
  filter: {
    status: string,
  },
  perPage: number,
};

class PartnerList extends React.PureComponent<Props> {
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
    const { viewType, ...filtersAndSort } = this.props;
    return (
      <Query query={query} variables={{ page: 1, ...filtersAndSort }} fetchPolicy="network-only">
        {({ loading, data, fetchMore, error }) => {
          if (error) {
            return error.message;
          }

          const nextPage = getByPathWithDefault(1, `${this.partnerPath}.page`, data) + 1;
          const totalPage = getByPathWithDefault(1, `${this.partnerPath}.totalPage`, data);
          const hasMore = nextPage <= totalPage;

          return (
            <PartnerGridView
              items={getByPathWithDefault([], `${this.partnerPath}.nodes`, data)}
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

export default PartnerList;
