// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import logger from 'utils/logger';
import type { FilterBy, SortBy } from 'types';
import TaskGridView from './TaskGridView';
import { taskListQuery } from './query';

type Props = {
  filterBy: FilterBy,
  sortBy: SortBy,
  perPage: number,
};

const TaskList = ({ ...filtersAndSort }: Props) => {
  return (
    <Query
      query={taskListQuery}
      variables={{
        page: 1,
        /* $FlowFixMe This comment suppresses an error found when upgrading
         * Flow to v0.111.0. To view the error, delete this comment and run
         * Flow. */
        ...filtersAndSort,
      }}
      fetchPolicy="network-only"
      onCompleted={logger.warn}
      onError={logger.error}
    >
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        const nextPage = getByPathWithDefault(1, 'tasks.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'tasks.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <TaskGridView
            items={getByPathWithDefault([], 'tasks.nodes', data)}
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'tasks')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default TaskList;
