// @flow
import * as React from 'react';
import { Redirect, Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { NAVIGATION_BATCH_LIST } from 'modules/permission/constants/navigation';
import BatchListModule from './index.list';
import BatchFormModule from './index.form';
import BatchSheetModule from './sheet';

const BatchFormModuleWrapper = withNotFound(BatchFormModule, 'batchId');
const BatchModuleListWrapper = withForbidden(BatchListModule, NAVIGATION_BATCH_LIST);
const BatchSheetModuleWrapper = withForbidden(BatchSheetModule, NAVIGATION_BATCH_LIST);

const BatchApp = () => (
  <Router>
    {/* $FlowFixMe Flow typed is not updated yet */}
    <Redirect path="/" from="/" to="/batch/cards" noThrow />
    <BatchModuleListWrapper path="/cards" />
    <BatchSheetModuleWrapper path="/table" />
    <BatchFormModuleWrapper path=":batchId" />
  </Router>
);

export default BatchApp;
