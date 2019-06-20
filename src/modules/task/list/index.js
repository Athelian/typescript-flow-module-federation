// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import logger from 'utils/logger';
import TaskGridView from './TaskGridView';
import { taskListQuery } from './query';

type Props = {
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
};

const TaskList = ({ ...filtersAndSort }: Props) => {
  return (
    <Query
      key={JSON.stringify(filtersAndSort)}
      query={taskListQuery}
      variables={{
        page: 1,
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
