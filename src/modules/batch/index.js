// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import BatchListContainer from './index.list';
import BatchFormContainer from './index.form';

const BatchApp = () => (
  <Router>
    <BatchListContainer path="/" />
    <BatchFormContainer path=":batchId" />
  </Router>
);

export default BatchApp;
