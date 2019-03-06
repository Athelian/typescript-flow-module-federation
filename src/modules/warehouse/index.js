// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { WAREHOUSE_CREATE, WAREHOUSE_LIST } from 'modules/permission/constants/warehouse';
import WarehouseListModule from './index.list';
import WarehouseFormModule from './index.form';

const WarehouseFormModuleWrapper = withNotFound(WarehouseFormModule, 'warehouseId');
const WarehouseFormModuleCreationWrapper = withForbidden(
  WarehouseFormModuleWrapper,
  WAREHOUSE_CREATE
);
const WarehouseModuleListWrapper = withForbidden(WarehouseListModule, WAREHOUSE_LIST);

const WarehouseApp = () => (
  <Router>
    <WarehouseModuleListWrapper path="/" />
    <WarehouseFormModuleCreationWrapper path="new" />
    <WarehouseFormModuleCreationWrapper path="clone/:warehouseId" />
    <WarehouseFormModuleWrapper path=":warehouseId" />
  </Router>
);

export default WarehouseApp;
