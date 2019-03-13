// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { Router } from '@reach/router';

import TaskListModule from './index.list';
import TaskFormModule from './index.form';

const TaskApp = () => (
  <Provider>
    <Router>
      <TaskListModule path="/" />
      <TaskFormModule path=":taskId" />
    </Router>
  </Provider>
);

export default TaskApp;
