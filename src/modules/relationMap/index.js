import React from 'react';
import { Router } from '@reach/router';
import Order from './index.orders';
import Shipment from './index.shipments';
import Products from './index.products';

const RelationMap = () => (
  <Router>
    <Order path="/orders" />
    <Shipment path="/shipments" />
    <Products path="/products" />
  </Router>
);

export default RelationMap;
