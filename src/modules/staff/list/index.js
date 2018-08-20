// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import StaffGridView from './components/StaffGridView';
import { userListQuery } from './query';

type Props = {
  viewType: string,
  filter: {
    status: string,
  },
  perPage: number,
};

class StaffList extends React.PureComponent<Props> {
  loadMore = (clientData: { fetchMore: Function, data: ?Object }) => {
    const { data, fetchMore } = clientData;
    if (!data) return;
    const nextPage = getByPathWithDefault(1, 'viewer.group.users.page', data) + 1;
    const totalPage = getByPathWithDefault(1, 'viewer.group.users.totalPage', data);
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
          getByPathWithDefault({}, 'viewer.group.users.page', prevResult) + 1 !==
            getByPathWithDefault({}, 'viewer.group.users.page', fetchMoreResult)
        ) {
          return prevResult;
        }

        if (getByPathWithDefault([], 'viewer.group.users.nodes', fetchMoreResult).length === 0)
          return prevResult;

        return {
          viewer: {
            ...prevResult.viewer,
            group: {
              ...prevResult.viewer.group,
              users: {
                ...prevResult.viewer.users,
                ...getByPathWithDefault({}, 'viewer.group.users', fetchMoreResult),
                nodes: [
                  ...prevResult.viewer.users.nodes,
                  ...getByPathWithDefault([], 'viewer.group.users.nodes', fetchMoreResult),
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
      <Query
        query={userListQuery}
        variables={{ page: 1, ...filtersAndSort }}
        fetchPolicy="network-only"
      >
        {({ loading, data, fetchMore, error }) => {
          if (error) {
            return error.message;
          }

          const nextPage = getByPathWithDefault(1, 'viewer.group.users.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'viewer.group.users.totalPage', data);
          const hasMore = nextPage <= totalPage;

          return (
            <StaffGridView
              items={getByPathWithDefault([], 'viewer.group.users.nodes', data)}
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

export default StaffList;
