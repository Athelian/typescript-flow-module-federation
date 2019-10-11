// @flow
import * as React from 'react';
import { Content } from 'components/Layout';
import {
  EntityIcon,
  Filter,
  NavBar,
  TaskFilterConfig,
  TaskSortConfig,
  Search,
  Sort,
} from 'components/NavBar';
import { ExportButton } from 'components/Buttons';
import useFilterSort from 'hooks/useFilterSort';
import TaskList from './list';
import { tasksExportQuery } from './query';

const TaskListModule = () => {
  const { query, filterBy, sortBy, setQuery, setFilterBy, setSortBy } = useFilterSort(
    { query: '' },
    { updatedAt: 'DESCENDING' },
    'task_cards'
  );

  return (
    <Content>
      <NavBar>
        <EntityIcon icon="TASK" color="TASK" subIcon="CARDS" />

        <Filter config={TaskFilterConfig} filterBy={filterBy} onChange={setFilterBy} />
        <Search query={query} onChange={setQuery} />
        <Sort config={TaskSortConfig} sortBy={sortBy} onChange={setSortBy} />

        <ExportButton
          type="Tasks"
          exportQuery={tasksExportQuery}
          variables={{
            filterBy: { query, ...filterBy },
            sortBy,
          }}
        />
      </NavBar>
      <TaskList filterBy={{ query, ...filterBy }} sortBy={sortBy} page={1} perPage={10} />
    </Content>
  );
};

export default TaskListModule;
