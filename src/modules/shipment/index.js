// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import { Provider } from 'unstated';
import ShipmentListModule from './index.list';
import ShipmentFormModule from './index.form';

const ShipmentApp = () => (
  <Provider>
    <Router>
      <ShipmentListModule path="/" />
      <ShipmentFormModule path="new" />
      <ShipmentFormModule path=":shipmentId/:anchor" />
      <ShipmentFormModule path=":shipmentId" />
      <ShipmentFormModule path="clone/:shipmentId" />
    </Router>
  </Provider>
);

export default ShipmentApp;
