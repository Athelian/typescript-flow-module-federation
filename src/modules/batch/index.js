// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { BATCH_LIST } from 'modules/permission/constants/batch';
import BatchListModule from './index.list';
import BatchFormModule from './index.form';

const BatchFormModuleWrapper = withNotFound(BatchFormModule, 'batchId');
const BatchModuleListWrapper = withForbidden(BatchListModule, BATCH_LIST);

const BatchApp = () => (
  <Router>
    <BatchModuleListWrapper path="/" />
    <BatchFormModuleWrapper path=":batchId" />
  </Router>
);

export default BatchApp;
