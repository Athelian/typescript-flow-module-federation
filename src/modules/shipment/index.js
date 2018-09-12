// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import ShipmentListModule from './index.list';
import ShipmentFormModule from './index.form';

const ShipmentApp = () => (
  <Router>
    <ShipmentListModule path="/" />
    <ShipmentFormModule path=":shipmentId" />
  </Router>
);

export default ShipmentApp;
