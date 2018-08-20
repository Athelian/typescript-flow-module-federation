// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import PartnerGridView from './components/PartnerGridView';
// import PartnerListView from './components/PartnerListView';
// import PartnerTableView from './components/PartnerTableView';
import query from './query.graphql';

type Props = {
  viewType: string,
  filter: {
    status: string,
  },
  perPage: number,
};

class PartnerList extends React.PureComponent<Props> {
  loadMore = (clientData: { fetchMore: Function, data: ?Object }) => {
    const { data, fetchMore } = clientData;
    if (!data) return;
    const nextPage = getByPathWithDefault(1, 'viewer.group.partners.page', data) + 1;
    const totalPage = getByPathWithDefault(1, 'viewer.group.partners.totalPage', data);
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
          getByPathWithDefault({}, 'viewer.group.partners.page', prevResult) + 1 !==
            getByPathWithDefault({}, 'viewer.group.partners.page', fetchMoreResult)
        ) {
          return prevResult;
        }

        if (getByPathWithDefault([], 'viewer.group.partners.nodes', fetchMoreResult).length === 0)
          return prevResult;

        return {
          viewer: {
            ...prevResult.viewer,
            group: {
              ...prevResult.viewer.group,
              partners: {
                ...prevResult.viewer.partners,
                ...getByPathWithDefault({}, 'viewer.group.partners', fetchMoreResult),
                nodes: [
                  ...prevResult.viewer.partners.nodes,
                  ...getByPathWithDefault([], 'viewer.group.partners.nodes', fetchMoreResult),
                ],
              },
            },
          },
        };
      },
    });
  };

  render() {
    const { viewType, ...filtersAndSort } = this.props;
    return (
      <Query query={query} variables={{ page: 1, ...filtersAndSort }} fetchPolicy="network-only">
        {({ loading, data, fetchMore, error }) => {
          if (error) {
            return error.message;
          }

          const nextPage = getByPathWithDefault(1, 'viewer.group.partners.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'viewer.group.partners.totalPage', data);
          const hasMore = nextPage <= totalPage;

          if (viewType === 'list') return null;

          if (viewType === 'table') return null;

          return (
            <PartnerGridView
              items={getByPathWithDefault([], 'viewer.group.partners.nodes', data)}
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
