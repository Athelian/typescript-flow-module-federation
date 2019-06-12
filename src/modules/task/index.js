// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { Router } from '@reach/router';
import withForbidden from 'hoc/withForbidden';
import { TASK_LIST } from 'modules/permission/constants/task';
import TaskListModule from './index.list';
import TaskFormModule from './index.form';

const TaskModuleListWrapper = withForbidden(TaskListModule, TASK_LIST);

const TaskApp = () => (
  <Provider>
    <Router>
      <TaskModuleListWrapper path="/" />
      <TaskFormModule path=":taskId" />
    </Router>
  </Provider>
);

export default TaskApp;
