// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { Router } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { ORDER_CREATE, ORDER_LIST } from 'modules/permission/constants/order';
import OrderListModule from './index.list';
import OrderFormModule from './index.form';

const OrderFormModuleWrapper = withNotFound(OrderFormModule, 'orderId');
const OrderFormModuleCreationWrapper = withForbidden(OrderFormModuleWrapper, ORDER_CREATE);
const OrderModuleListWrapper = withForbidden(OrderListModule, ORDER_LIST);

const OrderApp = () => (
  <Provider>
    <Router>
      <OrderModuleListWrapper path="/" />
      <OrderFormModuleCreationWrapper path="new" />
      <OrderFormModuleCreationWrapper path="clone/:orderId" />
      <OrderFormModuleWrapper path=":orderId" />
    </Router>
  </Provider>
);

export default OrderApp;
