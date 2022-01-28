// @flow
import * as React from 'react';
import { Router } from '@reach/router';

import NotificationListModule from './index.list';

const NotificationModule = () => (
  <Router>
    <NotificationListModule path="/:activeTab" />
    <NotificationListModule path="/" default />
  </Router>
);

export default NotificationModule;
