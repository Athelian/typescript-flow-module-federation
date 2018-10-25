import React from 'react';
import { Router } from '@reach/router';
import { Provider } from 'unstated';
import Order from './index.orders';
import Shipment from './index.shipments';
import Products from './index.products';

const RelationMap = () => (
  <Provider>
    <Router>
      <Order path="/orders" default />
      <Shipment path="/shipments" />
      <Products path="/products" />
    </Router>
  </Provider>
);

export default RelationMap;
