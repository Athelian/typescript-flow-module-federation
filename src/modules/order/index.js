// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { ORDER_CREATE, ORDER_GET, ORDER_LIST } from 'modules/permission/constants/order';
import OrderListModule from './index.list';
import OrderFormModule from './index.form';

const OrderFormModuleWrapper = withNotFound(OrderFormModule, 'orderId');
const OrderFormModuleDetailWrapper = withForbidden(OrderFormModuleWrapper, ORDER_GET);
const OrderFormModuleCreationWrapper = withForbidden(OrderFormModuleWrapper, ORDER_CREATE);
const OrderModuleListWrapper = withForbidden(OrderListModule, ORDER_LIST);

const OrderApp = () => (
  <Router>
    <OrderModuleListWrapper path="/" />
    <OrderFormModuleCreationWrapper path="new" />
    <OrderFormModuleCreationWrapper path="clone/:orderId" />
    <OrderFormModuleDetailWrapper path=":orderId" />
  </Router>
);

export default OrderApp;
