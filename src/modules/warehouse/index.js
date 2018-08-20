// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import WarehouseListContainer from './index.list';
import WarehouseFormContainer from './index.form';

const WarehouseApp = () => (
  <Router>
    <WarehouseListContainer path="/" />
    <WarehouseFormContainer path=":warehouseId" />
  </Router>
);

export default WarehouseApp;
