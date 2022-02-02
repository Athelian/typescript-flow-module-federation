// @flow
import * as React from 'react';
import { Router } from '@reach/router';

import ReminderListModule from './index.list';

const ReminderModule = () => (
  <Router>
    <ReminderListModule path="/" default />
  </Router>
);

export default ReminderModule;
