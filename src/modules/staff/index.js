// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { STAFF_CREATE, STAFF_FORM, STAFF_LIST } from 'modules/permission/constants/staff';
import StaffListModule from './index.list';
import StaffFormModule from './index.form';

const StaffFormModuleWrapper = withNotFound(StaffFormModule, 'staffId');
const StaffFormModuleDetailWrapper = withForbidden(StaffFormModuleWrapper, STAFF_FORM);
const StaffFormModuleCreationWrapper = withForbidden(StaffFormModuleWrapper, STAFF_CREATE);
const StaffModuleListWrapper = withForbidden(StaffListModule, STAFF_LIST);

const StaffApp = () => (
  <Router>
    <StaffModuleListWrapper path="/" />
    <StaffFormModuleCreationWrapper path="new" />
    <StaffFormModuleCreationWrapper path="clone/:staffId" />
    <StaffFormModuleDetailWrapper path=":staffId" />
  </Router>
);

export default StaffApp;
