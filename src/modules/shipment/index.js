// @flow
import * as React from 'react';
import { Redirect, Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { SHIPMENT_CREATE, SHIPMENT_LIST } from 'modules/permission/constants/shipment';
import ShipmentRelationalMapModule from 'modules/relationMapV2/shipment';
import ShipmentListModule from './index.list';
import ShipmentFormModule from './index.form';

const ShipmentFormModuleWrapper = withNotFound(ShipmentFormModule, 'shipmentId');
const ShipmentFormModuleCreationWrapper = withForbidden(ShipmentFormModuleWrapper, SHIPMENT_CREATE);
const ShipmentModuleListWrapper = withForbidden(ShipmentListModule, SHIPMENT_LIST);
const ShipmentRelationalMapModuleWrapper = withForbidden(
  ShipmentRelationalMapModule,
  SHIPMENT_LIST
);

const ShipmentApp = () => (
  <Router>
    <Redirect path="/" from="/" to="/shipment/cards" noThrow />
    <ShipmentModuleListWrapper path="/cards" />
    <ShipmentRelationalMapModuleWrapper path="/map" />
    <ShipmentFormModuleCreationWrapper path="new" />
    <ShipmentFormModuleCreationWrapper path="clone/:shipmentId" />
    <ShipmentFormModuleWrapper path=":shipmentId/:anchor" />
    <ShipmentFormModuleWrapper path=":shipmentId" />
  </Router>
);

export default ShipmentApp;
