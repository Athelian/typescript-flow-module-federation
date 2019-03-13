// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { TASK_CREATE, TASK_LIST } from 'modules/permission/constants/task';
import TaskListModule from './index.list';
import TaskFormModule from './index.form';

const TaskFormModuleWrapper = withNotFound(TaskFormModule, 'taskId');
const TaskFormModuleCreationWrapper = withForbidden(TaskFormModuleWrapper, TASK_CREATE);
const TaskModuleListWrapper = withForbidden(TaskListModule, TASK_LIST);

const TaskApp = () => (
  <Provider>
    <Router>
      <TaskModuleListWrapper path="/" />
      <TaskFormModuleCreationWrapper path="new" />
      <TaskFormModuleCreationWrapper path="clone/:taskId" />
      <TaskFormModuleWrapper path=":taskId" />
    </Router>
  </Provider>
);

export default TaskApp;
