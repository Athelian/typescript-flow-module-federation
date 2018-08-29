// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault, isEquals } from 'utils/fp';
import BatchGridView from './BatchGridView';
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
    const nextPage = getByPathWithDefault(1, 'batches.page', data) + 1;
    const totalPage = getByPathWithDefault(1, 'batches.totalPage', data);
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
          getByPathWithDefault({}, 'batches.page', prevResult) + 1 !==
            getByPathWithDefault({}, 'batches.page', fetchMoreResult)
        ) {
          return prevResult;
        }

        if (getByPathWithDefault([], 'batches.nodes', fetchMoreResult).length === 0)
          return prevResult;

        return {
          batches: {
            ...prevResult.batches,
            ...getByPathWithDefault({}, 'batches', fetchMoreResult),
            nodes: [
              ...prevResult.batches.nodes,
              ...getByPathWithDefault([], 'batches.nodes', fetchMoreResult),
            ],
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
