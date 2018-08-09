// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import PartnerGridView from './components/PartnerGridView';
import PartnerListView from './components/PartnerListView';
import PartnerTableView from './components/PartnerTableView';
import query from './query.graphql';

type Props = {
  viewType: string,
  filter: {
    status: string,
  },
  perPage: number,
};

class PartnerList extends React.PureComponent<Props> {
  loadMorePage = (clientData: { fetchMore: Function, data: ?Object }) => {
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
      <Query query={query} variables={{ page: 1, ...filtersAndSort }}>
        {({ loading, data, fetchMore, error }) => {
          const nextPage = getByPathWithDefault(1, 'viewer.group.partners.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'viewer.group.partners.totalPage', data);
          if (error) {
            return error.message;
          }

          if (loading) return <LoadingIcon />;

          if (viewType === 'list')
            return (
              <PartnerListView
                onLoadMore={() => this.loadMorePage({ fetchMore, data })}
                hasMore={nextPage <= totalPage}
                isLoading={loading}
                items={getByPathWithDefault([], 'viewer.group.partners.nodes', data)}
              />
            );

          if (viewType === 'table')
            return (
              <PartnerTableView
                onLoadMore={() => this.loadMorePage({ fetchMore, data })}
                hasMore={nextPage <= totalPage}
                isLoading={loading}
                items={getByPathWithDefault([], 'viewer.group.partners.nodes', data)}
              />
            );

          return (
            <PartnerGridView
              onLoadMore={() => this.loadMorePage({ fetchMore, data })}
              hasMore={nextPage <= totalPage}
              isLoading={loading}
              items={getByPathWithDefault([], 'viewer.group.partners.nodes', data)}
            />
          );
        }}
      </Query>
    );
  }
}

export default PartnerList;
