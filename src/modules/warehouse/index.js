// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import {
  WAREHOUSE_LIST,
  WAREHOUSE_CREATE,
  WAREHOUSE_GET,
} from 'modules/permission/constants/warehouse';
import usePermission from 'hooks/usePermission';
import WarehouseListContainer from './index.list';
import WarehouseFormContainer from './index.form';

const WarehouseApp = () => {
  const { hasPermission } = usePermission();
  const allowList = hasPermission(WAREHOUSE_LIST);
  const allowCreate = hasPermission(WAREHOUSE_CREATE);
  const allowGet = hasPermission(WAREHOUSE_GET);

  return (
    <Router>
      {allowList && <WarehouseListContainer path="/" />}
      {allowCreate && <WarehouseFormContainer path="new" />}
      {allowCreate && <WarehouseFormContainer path="clone/:warehouseId" />}
      {allowGet && <WarehouseFormContainer path=":warehouseId" />}
    </Router>
  );
};

export default WarehouseApp;
