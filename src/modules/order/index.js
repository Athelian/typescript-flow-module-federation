// @flow
import * as React from 'react';
import { Redirect, Router, Location } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import { ORDER_CREATE, ORDER_LIST } from 'modules/permission/constants/order';
import OrderRelationalMapModule from 'modules/relationMapV2/order';
import OrderListModule from './index.list';
import OrderFormModule from './index.form';
import OrderSheetModule from './sheet';

const OrderFormModuleWrapper = withNotFound(OrderFormModule, 'orderId');
const OrderFormModuleCreationWrapper = withForbidden(OrderFormModuleWrapper, ORDER_CREATE);
const OrderListModuleWrapper = withForbidden(OrderListModule, ORDER_LIST);
const OrderSheetModuleWrapper = withForbidden(OrderSheetModule, ORDER_LIST);
const OrderRelationalMapModuleWrapper = withForbidden(OrderRelationalMapModule, ORDER_LIST);

const OrderApp = () => (
  <Location>
    {({ location }) => (
      <Router location={location}>
        <Redirect path="/" from="/" to="/order/cards" noThrow />
        <OrderListModuleWrapper path="/cards" />
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
