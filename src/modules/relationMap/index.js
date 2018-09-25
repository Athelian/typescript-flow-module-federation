import React from 'react';
import { Router } from '@reach/router';
import Order from './index.orders';
import Shipment from './index.shipments';

const RelationMap = () => (
  <Router>
    <Order path="/orders" />
    <Shipment path="/shipments" />
  </Router>
);

export default RelationMap;
