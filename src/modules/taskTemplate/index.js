// @flow
import React from 'react';
import { Router } from '@reach/router';

import TaskTemplateListModule from './index.list';

const TaskTemplateModule = () => (
  <Router>
    <TaskTemplateListModule path="/" />
  </Router>
);

export default TaskTemplateModule;
