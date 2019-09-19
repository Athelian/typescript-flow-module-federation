// @flow
import * as React from 'react';
import { Router, Location } from '@reach/router';
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
  <Location>
    {({ location }) => (
      <Router location={location}>
        <OrderModuleListWrapper path="/list" />
        <OrderSheetModuleWrapper path="/sheet" orderIds={location?.state?.orderIds ?? []} />
        <OrderFormModuleCreationWrapper path="new" />
        <OrderFormModuleCreationWrapper path="clone/:orderId" />
        <OrderFormModuleWrapper path=":orderId" />
      </Router>
    )}
  </Location>
);

export default OrderApp;
