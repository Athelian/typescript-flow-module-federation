// @flow
import * as React from 'react';
import { Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { ORDER_ITEMS_CREATE, ORDER_ITEMS_LIST } from 'modules/permission/constants/orderItem';
import OrderListModule from './index.list';
import OrderFormModule from './index.form';

const OrderFormModuleWrapper = withNotFound(OrderFormModule, 'orderItemId');
const OrderFormModuleCreationWrapper = withForbidden(OrderFormModuleWrapper, ORDER_ITEMS_CREATE);
const OrderModuleListWrapper = withForbidden(OrderListModule, ORDER_ITEMS_LIST);

const OrderApp = () => (
  <Router>
    <OrderModuleListWrapper path="/" />
    <OrderFormModuleCreationWrapper path="new" />
    <OrderFormModuleCreationWrapper path="clone/:orderItemId" />
    <OrderFormModuleWrapper path=":orderItemId" />
  </Router>
);

export default OrderApp;
