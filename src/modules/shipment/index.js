// @flow
import * as React from 'react';
import { Location, Redirect, Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { SHIPMENT_CREATE, SHIPMENT_LIST } from 'modules/permission/constants/shipment';
import ShipmentRelationalMapModule from 'modules/relationMapV2/shipment';
import ShipmentListModule from './index.list';
import ShipmentFormModule from './index.form';
import ShipmentSheetModule from './sheet';

const ShipmentFormModuleWrapper = withNotFound(ShipmentFormModule, 'shipmentId');
const ShipmentFormModuleCreationWrapper = withForbidden(ShipmentFormModuleWrapper, SHIPMENT_CREATE);
const ShipmentModuleListWrapper = withForbidden(ShipmentListModule, SHIPMENT_LIST);
const ShipmentSheetModuleWrapper = withForbidden(ShipmentSheetModule, SHIPMENT_LIST);
const ShipmentRelationalMapModuleWrapper = withForbidden(
  ShipmentRelationalMapModule,
  SHIPMENT_LIST
);

const ShipmentApp = () => (
  <Location>
    {({ location }) => (
      <Router location={location}>
        {/* $FlowFixMe Flow typed is not updated yet */}
        <Redirect path="/" from="/" to="/shipment/map" noThrow />
        <ShipmentModuleListWrapper path="/cards" />
        {/* $FlowFixMe Flow typed is not updated yet */}
        <ShipmentSheetModuleWrapper path="/table" shipmentIds={location?.state?.shipmentIds} />
        <ShipmentRelationalMapModuleWrapper path="/map" />
        <ShipmentFormModuleCreationWrapper path="new" />
        <ShipmentFormModuleCreationWrapper path="clone/:shipmentId" />
        <ShipmentFormModuleWrapper path=":shipmentId/:anchor" />
        <ShipmentFormModuleWrapper path=":shipmentId" />
      </Router>
    )}
  </Location>
);

export default ShipmentApp;
