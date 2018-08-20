// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import StaffListContainer from './index.list';
import StaffFormContainer from './index.form';

const StaffApp = () => (
  <Router>
    <StaffListContainer path="/" />
    <StaffFormContainer path=":staffId" />
  </Router>
);

export default StaffApp;
