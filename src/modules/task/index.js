// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { Router, Redirect } from '@reach/router';
import withForbidden from 'hoc/withForbidden';
import { TASK_LIST } from 'modules/permission/constants/task';
import TaskListModule from './index.list';
import TaskFormModule from './index.form';

const TaskModuleListWrapper = withForbidden(TaskListModule, TASK_LIST);

const TaskApp = () => (
  <Provider>
    <Router>
      {/* $FlowFixMe Flow typed is not updated yet */}
      <Redirect path="/" from="/" to="/task/cards" noThrow />
      <TaskModuleListWrapper path="/cards" />
      <TaskFormModule path=":taskId" />
    </Router>
  </Provider>
);

export default TaskApp;
