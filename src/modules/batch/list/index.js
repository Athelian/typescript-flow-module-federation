// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import BatchGridView from './components/BatchGridView';
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
  loadMore = (clientData: { fetchMore: Function, data: ?Object }) => {
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
        const { filter, sort, perPage } = this.props;
        if (
          !isEquals({ filter, sort, perPage }, filtersAndSort) ||
          getByPathWithDefault({}, 'viewer.batchItems.page', prevResult) + 1 !==
            getByPathWithDefault({}, 'viewer.batchItems.page', fetchMoreResult)
        ) {
          return prevResult;
        }

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
      <Query
        query={batchItemListQuery}
        variables={{ page: 1, ...filtersAndSort }}
        fetchPolicy="network-only"
      >
        {({ loading, data, fetchMore, error }) => {
          if (error) {
            return error.message;
          }

          const nextPage = getByPathWithDefault(1, 'batches.page', data) + 1;
          const totalPage = getByPathWithDefault(1, 'batches.totalPage', data);
          const hasMore = nextPage <= totalPage;

          return (
            <BatchGridView
              items={getByPathWithDefault([], 'batches.nodes', data)}
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

export default BatchList;
