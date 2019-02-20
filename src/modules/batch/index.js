// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import { BATCH_LIST, BATCH_GET, BATCH_CREATE } from 'modules/permission/constants/batch';
import usePermission from 'hooks/usePermission';
import BatchListModule from './index.list';
import BatchFormModule from './index.form';

const BatchApp = () => {
  const { hasPermission } = usePermission();

  const allowList = hasPermission(BATCH_LIST);
  const allowGet = hasPermission(BATCH_GET);
  const allowCreate = hasPermission(BATCH_CREATE);

  return (
    <Router>
      {allowList && <BatchListModule path="/" />}
      {allowCreate && <BatchFormModule path="new" />}
      {allowCreate && <BatchFormModule path="clone/:batchId" />}
      {allowGet && <BatchFormModule path=":batchId" />}
    </Router>
  );
};

export default BatchApp;
