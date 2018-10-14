// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import BatchListModule from './index.list';
import BatchFormModule from './index.form';

const BatchApp = () => (
  <Router>
    <BatchListModule path="/" />
    <BatchFormModule path="new" />
    <BatchFormModule path="clone/:batchId" />
    <BatchFormModule path=":batchId" />
  </Router>
);

export default BatchApp;
