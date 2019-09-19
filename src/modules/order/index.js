// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { ORDER_CREATE, ORDER_LIST } from 'modules/permission/constants/order';
import OrderListModule from './index.list';
import OrderFormModule from './index.form';
import OrderSheetModule from './sheet';

const OrderFormModuleWrapper = withNotFound(OrderFormModule, 'orderId');
const OrderFormModuleCreationWrapper = withForbidden(OrderFormModuleWrapper, ORDER_CREATE);
const OrderModuleListWrapper = withForbidden(OrderListModule, ORDER_LIST);
const OrderSheetModuleWrapper = withForbidden(OrderSheetModule, ORDER_LIST);

const OrderApp = () => (
  <Router>
    <OrderModuleListWrapper path="/list" />
    <OrderSheetModuleWrapper path="/sheet" />
    <OrderFormModuleCreationWrapper path="new" />
    <OrderFormModuleCreationWrapper path="clone/:orderId" />
    <OrderFormModuleWrapper path=":orderId" />
  </Router>
);

export default OrderApp;
