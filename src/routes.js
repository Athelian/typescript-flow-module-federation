// @flow
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Router } from '@reach/router';
import Loadable from 'react-loadable';
import PageNotFound from './components/PageNotFound';
import NoPermission from './components/NoPermission';
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

const AsyncTags = LoadableComponent(() => import('./modules/tags'));
const AsyncStaff = LoadableComponent(() => import('./modules/staff'));
const AsyncPartner = LoadableComponent(() => import('./modules/partner'));
const AsyncWarehouse = LoadableComponent(() => import('./modules/warehouse'));
const AsyncShipment = LoadableComponent(() => import('./modules/shipment'));
const AsyncProduct = LoadableComponent(() => import('./modules/product'));
const AsyncBatch = LoadableComponent(() => import('./modules/batch'));
const AsyncRelationMap = LoadableComponent(() => import('./modules/relationMap'));
const AsyncNotifications = LoadableComponent(() => import('./modules/notifications'));

const Routes = () => (
  <div>
    <SideBar />
    <Router>
      <Authorized path="/">
        <DashBoard path="/" />
        <Order path="order/*" />
        <AsyncBatch path="batch/*" />
        <AsyncShipment path="shipment/*" />
        <AsyncProduct path="product/*" />
        <AsyncWarehouse path="warehouse/*" />
        <AsyncPartner path="partner/*" />
        <AsyncStaff path="staff/*" />
        <AsyncTags path="tags/*" />
        <AsyncRelationMap path="relation-map/*" />
        <AsyncNotifications path="notifications/*" />
        <PageNotFound default />
      </Authorized>
      <Login path="/login" redirectUrl="/order" />
      <NoPermission path="/403" />
      <PageNotFound default />
    </Router>
  </div>
);

export default hot(module)(Routes);
