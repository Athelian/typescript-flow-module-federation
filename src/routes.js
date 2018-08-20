// @flow
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Router } from '@reach/router';
import Loadable from 'react-loadable';
import PageNotFound from './components/PageNotFound';
import DashBoard from './modules/dashboard';
import Order from './modules/order';
import Batch from './modules/batch';
import Shipment from './modules/shipment';
import Product from './modules/product';
import Warehouse from './modules/warehouse';
import Partner from './modules/partner';
import Staff from './modules/staff';
import Login from './modules/login';
import SideBar from './modules/sidebar';
import Authorized from './components/Authorized';

const LoadableComponent = loader =>
  Loadable({
    loader,
    loading: () => null,
  });

const AsyncTags = LoadableComponent(() => import('./modules/tags'));

const Routes = () => (
  <div>
    <SideBar />
    <Router>
      <Authorized path="/">
        <DashBoard path="/" />
        <Order path="order/*" />
        <Batch path="batch/*" />
        <Shipment path="shipment/*" />
        <Product path="product/*" />
        <Warehouse path="warehouse/*" />
        <Partner path="partner/*" />
        <Staff path="staff/*" />
        <AsyncTags path="tags/*" />
        <PageNotFound default />
      </Authorized>
      <Login path="/login" redirectUrl="/order" />
      <PageNotFound default />
    </Router>
  </div>
);

export default hot(module)(Routes);
