// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { ORDER_CREATE, ORDER_LIST } from 'modules/permission/constants/order';
import OrderListModule from './index.list';
import OrderFormModule from './index.form';

const OrderFormModuleWrapper = withNotFound(OrderFormModule, 'orderId');
const OrderFormModuleCreationWrapper = withForbidden(OrderFormModuleWrapper, ORDER_CREATE);
const OrderFormModuleListWrapper = withForbidden(OrderListModule, ORDER_LIST);

const OrderApp = () => (
  <Router>
    <OrderFormModuleListWrapper path="/" />
    <OrderFormModuleCreationWrapper path="new" />
    <OrderFormModuleCreationWrapper path="clone/:orderId" />
    <OrderFormModuleCreationWrapper path=":orderId" />
  </Router>
);

export default OrderApp;
