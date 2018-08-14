// @flow
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Router } from '@reach/router';
import Loadable from 'react-loadable';
import PageNotFound from './components/PageNotFound';
import DashBoard from './modules/dashboard';
import Order from './modules/order';
import Login from './modules/login';
import SideBar from './modules/sidebar';
import Authorized from './components/Authorized';

const LoadableComponent = loader =>
  Loadable({
    loader,
    loading: () => null,
  });

const AsyncProduct = LoadableComponent(() => import('./modules/product'));
const AsyncShipment = LoadableComponent(() => import('./modules/shipment'));
const AsyncBatch = LoadableComponent(() => import('./modules/batch'));
const AsyncWarehouse = LoadableComponent(() => import('./modules/warehouse'));
const AsyncPartner = LoadableComponent(() => import('./modules/partner'));
const AsyncStaff = LoadableComponent(() => import('./modules/staff'));
const AsyncTags = LoadableComponent(() => import('./modules/tags'));

const Routes = () => (
  <div>
    <SideBar />
    <Router>
      <Authorized path="/">
        <DashBoard path="/" />
        <Order path="order/*" />
        <AsyncProduct path="product/*" />
        <AsyncShipment path="shipment/*" />
        <AsyncBatch path="batch/*" />
        <AsyncWarehouse path="warehouse/*" />
        <AsyncPartner path="partner/*" />
        <AsyncStaff path="staff/*" />
        <AsyncTags path="tags/*" />
        <PageNotFound default />
      </Authorized>
      <Login path="/login" redirectUrl="/order" />
      <PageNotFound default />
    </Router>
  </div>
);

export default hot(module)(Routes);
