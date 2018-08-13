// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import OrderListModule from './index.list';
import OrderFormModule from './index.form';

const OrderApp = () => (
  <Router>
    <OrderListModule path="/" />
    <OrderFormModule path=":orderId" />
  </Router>
);

export default OrderApp;
