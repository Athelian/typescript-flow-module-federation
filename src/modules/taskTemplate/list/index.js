// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import apolloClient from 'apollo';
import { getByPathWithDefault } from 'utils/fp';
import loadMore from 'utils/loadMore';
import emitter from 'utils/emitter';
import logger from 'utils/logger';
import TaskTemplateGridView from './TaskTemplateGridView';
import { taskTemplateListQuery } from './query';

type Props = {
  entityType: string,
  sortBy: {
    [field: string]: string,
  },
  perPage: number,
};

const TaskTemplateList = ({ entityType, ...filtersAndSort }: Props) => {
  React.useEffect(() => {
    emitter.once('RELOAD_TASK_TEMPLATE', () => {
      apolloClient.reFetchObservableQueries();
    });
  });

  return (
    <Query
      query={taskTemplateListQuery}
      key={entityType}
      variables={{
        ...filtersAndSort,
        page: 1,
        filterBy: {
          entityTypes: [entityType],
        },
      }}
      fetchPolicy="network-only"
      onCompleted={logger.warn}
      onError={logger.error}
    >
      {({ loading, data, fetchMore, error }) => {
        if (error) {
          return error.message;
        }
        const nextPage = getByPathWithDefault(1, 'taskTemplates.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'taskTemplates.totalPage', data);
        const hasMore = nextPage <= totalPage;

        return (
          <TaskTemplateGridView
            items={getByPathWithDefault([], 'taskTemplates.nodes', data)}
            onLoadMore={() => loadMore({ fetchMore, data }, filtersAndSort, 'taskTemplates')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default TaskTemplateList;
