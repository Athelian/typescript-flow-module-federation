// @flow
import * as React from 'react';
import { Redirect, Router, Location } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { NAVIGATION_ORDERS_LIST } from 'modules/permission/constants/navigation';
import { ORDER_CREATE } from 'modules/permission/constants/order';
import OrderRelationalMapModule from 'modules/relationMapV2/order';
import OrderListModule from './index.list';
import OrderFormModule from './index.form';
import OrderSheetModule from './sheet';

const OrderFormModuleWrapper = withNotFound(OrderFormModule, 'orderId');
const OrderFormModuleCreationWrapper = withForbidden(OrderFormModuleWrapper, ORDER_CREATE);
const OrderListModuleWrapper = withForbidden(OrderListModule, NAVIGATION_ORDERS_LIST);
const OrderSheetModuleWrapper = withForbidden(OrderSheetModule, NAVIGATION_ORDERS_LIST);
const OrderRelationalMapModuleWrapper = withForbidden(
  OrderRelationalMapModule,
  NAVIGATION_ORDERS_LIST
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
