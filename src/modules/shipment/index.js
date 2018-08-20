// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import ShipmentListContainer from './index.list';
import ShipmentFormContainer from './index.form';

const ShipmentApp = () => (
  <Router>
    <ShipmentListContainer path="/" />
    <ShipmentFormContainer path=":shipmentId" />
  </Router>
);

export default ShipmentApp;
