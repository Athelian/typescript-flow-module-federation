// @flow
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Router } from '@reach/router';
import Loadable from 'react-loadable';
import DashBoard from './modules/dashboard';
import LoadingIcon from './components/LoadingIcon';
import PageNotFound from './components/PageNotFound';
import Login from './modules/login';
import Authorized from './components/Authorized';

const LoadableComponent = loader =>
  Loadable({
    loader,
    loading: () => <LoadingIcon />,
  });

const AsyncProduct = LoadableComponent(() => import('./modules/product'));
const AsyncOrder = LoadableComponent(() => import('./modules/order'));
const AsyncShipment = LoadableComponent(() => import('./modules/shipment'));
const AsyncBatch = LoadableComponent(() => import('./modules/batch'));
const AsyncWarehouse = LoadableComponent(() => import('./modules/warehouse'));
const AsyncPartner = LoadableComponent(() => import('./modules/partner'));
const AsyncStaff = LoadableComponent(() => import('./modules/staff'));
const AsyncTags = LoadableComponent(() => import('./modules/tags'));

const Routes = () => (
  <Router>
    <Authorized path="/">
      <DashBoard path="/" />
      <AsyncOrder path="order/*" />
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
);

export default hot(module)(Routes);
