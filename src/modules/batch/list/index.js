// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import BatchGridView from './components/BatchGridView';
import BatchListView from './components/BatchListView';
import BatchTableView from './components/BatchTableView';
import { batchItemListQuery } from './query';

type Props = {
  viewType: string,
  filter: {
    query: string,
    status: string,
  },
  sort: {
    field: string,
    direction: string,
  },
  perPage: number,
};

class BatchList extends React.PureComponent<Props> {
  loadMorePage = (clientData: { fetchMore: Function, data: ?Object }) => {
    const { data, fetchMore } = clientData;
    if (!data) return;
    const nextPage = getByPathWithDefault(1, 'viewer.batchItems.page', data) + 1;
    const totalPage = getByPathWithDefault(1, 'viewer.batchItems.totalPage', data);
    if (nextPage > totalPage) return;

    const { viewType, ...filtersAndSort } = this.props;
    fetchMore({
      variables: {
        page: nextPage,
        ...filtersAndSort,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (getByPathWithDefault([], 'viewer.batchItems.nodes', fetchMoreResult).length === 0)
          return prevResult;

        return {
          viewer: {
            ...prevResult.viewer,
            batchItems: {
              ...prevResult.viewer.batchItems,
              ...getByPathWithDefault({}, 'viewer.batchItems', fetchMoreResult),
              nodes: [
                ...prevResult.viewer.batchItems.nodes,
                ...getByPathWithDefault([], 'viewer.batchItems.nodes', fetchMoreResult),
              ],
            },
          },
        };
      },
    });
  };

  render() {
    const { viewType, ...filtersAndSort } = this.props;
    return (
      <Query query={batchItemListQuery} variables={{ page: 1, ...filtersAndSort }}>
        {({ loading, data, fetchMore, error }) => {
          const nextPage = getByPathWithDefault(1, 'viewer.batchItems.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'viewer.batchItems.totalPage', data);
          if (error) {
            return error.message;
          }

          if (loading) return <LoadingIcon />;

          if (viewType === 'list')
            return (
              <BatchListView
                onLoadMore={() => this.loadMorePage({ fetchMore, data })}
                hasMore={nextPage <= totalPage}
                isLoading={loading}
                items={getByPathWithDefault([], 'viewer.batchItems.nodes', data)}
              />
            );

          if (viewType === 'table')
            return (
              <BatchTableView
                onLoadMore={() => this.loadMorePage({ fetchMore, data })}
                hasMore={nextPage <= totalPage}
                isLoading={loading}
                items={getByPathWithDefault([], 'viewer.batchItems.nodes', data)}
              />
            );

          return (
            <BatchGridView
              onLoadMore={() => this.loadMorePage({ fetchMore, data })}
              hasMore={nextPage <= totalPage}
              isLoading={loading}
              items={getByPathWithDefault([], 'viewer.batchItems.nodes', data)}
            />
          );
        }}
      </Query>
    );
  }
}

export default BatchList;
