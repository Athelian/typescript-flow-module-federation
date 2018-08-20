// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import PartnerListContainer from './index.list';
import PartnerFormContainer from './index.form';

const PartnerApp = () => (
  <Router>
    <PartnerListContainer path="/" />
    <PartnerFormContainer path=":warehouseId" />
  </Router>
);

export default PartnerApp;
