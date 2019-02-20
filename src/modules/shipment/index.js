// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import {
  SHIPMENT_CREATE,
  SHIPMENT_FORM,
  SHIPMENT_LIST,
} from 'modules/permission/constants/shipment';
import ShipmentListModule from './index.list';
import ShipmentFormModule from './index.form';

const ShipmentFormModuleWrapper = withNotFound(ShipmentFormModule, 'shipmentId');
const ShipmentFormModuleDetailWrapper = withForbidden(ShipmentFormModuleWrapper, SHIPMENT_FORM);
const ShipmentFormModuleCreationWrapper = withForbidden(ShipmentFormModuleWrapper, SHIPMENT_CREATE);
const ShipmentModuleListWrapper = withForbidden(ShipmentListModule, SHIPMENT_LIST);

const ShipmentApp = () => (
  <Provider>
    <Router>
      <ShipmentModuleListWrapper path="/" />
      <ShipmentFormModuleCreationWrapper path="new" />
      <ShipmentFormModuleCreationWrapper path="clone/:shipmentId" />
      <ShipmentFormModuleDetailWrapper path=":shipmentId/:anchor" />
      <ShipmentFormModuleDetailWrapper path=":shipmentId" />
    </Router>
  </Provider>
);

export default ShipmentApp;
