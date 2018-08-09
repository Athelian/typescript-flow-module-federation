// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import StaffGridView from './components/StaffGridView';
import StaffListView from './components/StaffListView';
import StaffTableView from './components/StaffTableView';
import { userListQuery } from './query';

type Props = {
  viewType: string,
  filter: {
    status: string,
  },
  perPage: number,
};

class StaffList extends React.PureComponent<Props> {
  loadMorePage = (clientData: { fetchMore: Function, data: ?Object }) => {
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
      <Query query={userListQuery} variables={{ page: 1, ...filtersAndSort }}>
        {({ loading, data, fetchMore, error }) => {
          const nextPage = getByPathWithDefault(1, 'viewer.group.users.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'viewer.group.users.totalPage', data);
          if (error) {
            return error.message;
          }

          if (loading) return <LoadingIcon />;

          if (viewType === 'list')
            return (
              <StaffListView
                onLoadMore={() => this.loadMorePage({ fetchMore, data })}
                hasMore={nextPage <= totalPage}
                isLoading={loading}
                items={getByPathWithDefault([], 'viewer.group.users.nodes', data)}
              />
            );

          if (viewType === 'table')
            return (
              <StaffTableView
                onLoadMore={() => this.loadMorePage({ fetchMore, data })}
                hasMore={nextPage <= totalPage}
                isLoading={loading}
                items={getByPathWithDefault([], 'viewer.group.users.nodes', data)}
              />
            );

          return (
            <StaffGridView
              onLoadMore={() => this.loadMorePage({ fetchMore, data })}
              hasMore={nextPage <= totalPage}
              isLoading={loading}
              items={getByPathWithDefault([], 'viewer.group.users.nodes', data)}
            />
          );
        }}
      </Query>
    );
  }
}

export default StaffList;
