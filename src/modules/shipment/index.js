// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import { Provider } from 'unstated';
import usePermission from 'hooks/usePermission';
import {
  SHIPMENT_CREATE,
  SHIPMENT_LIST,
  SHIPMENT_GET,
} from 'modules/permission/constants/shipment';
import ShipmentListModule from './index.list';
import ShipmentFormModule from './index.form';

const ShipmentApp = () => {
  const { hasPermission } = usePermission();
  // NOTE: We will meet the react fragment error inside the <Router>
  // so instead of fragment, we will call per line
  // refer https://github.com/FormidableLabs/enzyme-matchers/issues/198
  const allowToCreate = hasPermission(SHIPMENT_CREATE);
  return (
    <Provider>
      <Router>
        {hasPermission(SHIPMENT_LIST) && <ShipmentListModule path="/" />}
        {allowToCreate && <ShipmentFormModule path="new" />}
        {hasPermission(SHIPMENT_GET) && <ShipmentFormModule path=":shipmentId/:anchor" />}
        {hasPermission(SHIPMENT_GET) && <ShipmentFormModule path=":shipmentId" />}
        {allowToCreate && <ShipmentFormModule path="clone/:shipmentId" />}
      </Router>
    </Provider>
  );
};

export default ShipmentApp;
