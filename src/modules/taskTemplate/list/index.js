// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import emitter from 'utils/emitter';
import loadMore from 'utils/loadMore';
import logger from 'utils/logger';
import TaskTemplateGridView from './TaskTemplateGridView';
import { taskTemplateListQuery } from './query';

type Props = {
  entityType: string,
  queryVariables: Object,
};

const TaskTemplateList = ({ entityType, queryVariables }: Props) => {
  return (
    <Query
      query={taskTemplateListQuery}
      key={entityType}
      variables={queryVariables}
      fetchPolicy="network-only"
      onCompleted={logger.warn}
      onError={logger.error}
    >
      {({ loading, data, fetchMore, error, refetch }) => {
        if (error) {
          return error.message;
        }
        const nextPage = getByPathWithDefault(1, 'taskTemplates.page', data) + 1;
        const totalPage = getByPathWithDefault(1, 'taskTemplates.totalPage', data);
        const hasMore = nextPage <= totalPage;

        emitter.once('REFETCH_TASK_TEMPLATES', () => {
          refetch(queryVariables);
        });

        return (
          <TaskTemplateGridView
            items={getByPathWithDefault([], 'taskTemplates.nodes', data)}
            onLoadMore={() => loadMore({ fetchMore, data }, queryVariables, 'taskTemplates')}
            hasMore={hasMore}
            isLoading={loading}
          />
        );
      }}
    </Query>
  );
};

export default TaskTemplateList;
