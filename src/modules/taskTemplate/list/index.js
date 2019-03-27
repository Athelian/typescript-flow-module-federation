// @flow
import React from 'react';
import loadMore from 'utils/loadMore';

import TaskTemplateGridView from './TaskTemplateGridView';

type Props = {
  entityType: string,
};

const TaskTemplate = ({ entityType }: Props) => {
  const fetchMore = () => {};
  const data = [
    { id: 1, name: 'tt1', memo: '123', entityType },
    { id: 2, name: 'tt1', memo: '456', entityType },
    { id: 3, name: 'tt2', memo: '789', entityType },
  ];
  const hasMore = false;
  const loading = false;
  return (
    <TaskTemplateGridView
      items={data}
      onLoadMore={() => loadMore({ fetchMore, data })}
      hasMore={hasMore}
      isLoading={loading}
    />
  );
};

export default TaskTemplate;
