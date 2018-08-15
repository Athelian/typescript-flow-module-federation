// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import OrderListContainer from './index.list';
import OrderFormContainer from './index.form';

const OrderApp = () => (
  <Router>
    <OrderListContainer path="/" />
    <OrderFormContainer path=":orderId" />
  </Router>
);

export default OrderApp;
