// @flow
import * as React from 'react';
import { Redirect, Router, Location } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import {
  NAVIGATION_ORDERS_MAP,
  NAVIGATION_ORDERS_TABLE,
  NAVIGATION_ORDERS_CARD,
} from 'modules/permission/constants/navigation';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import OrderRelationalMapModule from 'modules/relationMapV2/order';
import OrderListModule from './index.list';
import OrderFormModule from './index.form';
import OrderSheetModule from './sheet';

const OrderListPermissions = [
  NAVIGATION_ORDERS_MAP,
  NAVIGATION_ORDERS_TABLE,
  NAVIGATION_ORDERS_CARD,
];
const OrderFormModuleWrapper = withNotFound(OrderFormModule, 'orderId');
const OrderFormModuleCreationWrapper = withForbidden(OrderFormModuleWrapper, ORDER_CREATE);
const OrderListModuleWrapper = withForbidden(OrderListModule, OrderListPermissions);
const OrderSheetModuleWrapper = withForbidden(OrderSheetModule, OrderListPermissions);
const OrderRelationalMapModuleWrapper = withForbidden(
  OrderRelationalMapModule,
  OrderListPermissions
);

const OrderApp = () => (
  <Location>
    {({ location }) => (
      <Router location={location}>
        {/* $FlowFixMe Flow typed is not updated yet */}
        <Redirect path="/" from="/" to="/order/cards" noThrow />
        <OrderListModuleWrapper path="/cards" />
        {/* $FlowFixMe Flow typed is not updated yet */}
        <OrderSheetModuleWrapper path="/table" orderIds={location?.state?.orderIds} />
        <OrderRelationalMapModuleWrapper path="/map" />
        <OrderFormModuleCreationWrapper path="new" />
        <OrderFormModuleCreationWrapper path="clone/:orderId" />
        <OrderFormModuleWrapper path=":orderId" />
      </Router>
    )}
  </Location>
);

export default OrderApp;
