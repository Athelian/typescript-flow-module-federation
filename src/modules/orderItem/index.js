// @flow
import * as React from 'react';
import { Provider } from 'unstated';
import { Router, Redirect } from '@reach/router';
import withNotFound from 'hoc/withNotFound';
import withForbidden from 'hoc/withForbidden';
import {
  ORDER_ITEMS_CREATE,
  ORDER_ITEMS_FORM,
  ORDER_ITEMS_LIST,
} from 'modules/permission/constants/orderItem';
import OrderItemListModule from './index.list';
import OrderItemFormModule from './index.form';

const OrderItemFormModuleWrapper = withNotFound(OrderItemFormModule, 'orderItemId');
const OrderItemFormModuleCreationWrapper = withForbidden(
  OrderItemFormModuleWrapper,
  ORDER_ITEMS_CREATE
);
const OrderItemFormDetailModuleWrapper = withForbidden(
  OrderItemFormModuleWrapper,
  ORDER_ITEMS_FORM
);
const OrderItemModuleListWrapper = withForbidden(OrderItemListModule, ORDER_ITEMS_LIST);

const OrderItemApp = () => (
  <Provider>
    <Router>
      <Redirect path="/" from="/" to="/order-item/cards" noThrow />
      <OrderItemModuleListWrapper path="/cards" />
      <OrderItemFormModuleCreationWrapper path="new" />
      <OrderItemFormModuleCreationWrapper path="clone/:orderItemId" />
      <OrderItemFormDetailModuleWrapper path=":orderItemId" />
    </Router>
  </Provider>
);

export default OrderItemApp;
