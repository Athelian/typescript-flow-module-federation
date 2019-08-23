// @flow
import * as React from 'react';
import { Router } from '@reach/router';

import GlobalView from './index.form';

const GlobalViewModule = () => (
  <Router>
    <GlobalView path="/" />
  </Router>
);

export default GlobalViewModule;
