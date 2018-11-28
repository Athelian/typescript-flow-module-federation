// @flow
// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
import React, { lazy, Suspense } from 'react';
import { hot } from 'react-hot-loader';
import { Router } from '@reach/router';
import LoadingIcon from './components/LoadingIcon';
import PageNotFound from './components/PageNotFound';
import NoPermission from './components/NoPermission';
import DashBoard from './modules/dashboard';
import Order from './modules/order';
import Login from './modules/login';
import SideBar from './modules/sidebar';
import Authorized from './components/Authorized';

// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
const AsyncTags = lazy(() => import('./modules/tags'));
// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
const AsyncStaff = lazy(() => import('./modules/staff'));
// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
const AsyncPartner = lazy(() => import('./modules/partner'));
// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
const AsyncWarehouse = lazy(() => import('./modules/warehouse'));
// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
const AsyncShipment = lazy(() => import('./modules/shipment'));
// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
const AsyncProduct = lazy(() => import('./modules/product'));
// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
const AsyncBatch = lazy(() => import('./modules/batch'));
// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
const AsyncRelationMap = lazy(() => import('./modules/relationMap'));
// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
const AsyncNotifications = lazy(() => import('./modules/notifications'));
// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
const AsyncMetadata = lazy(() => import('./modules/metadata'));
// $FlowFixMe: it is open issue on flow https://github.com/facebook/flow/issues/7093
const AsyncTableTemplate = lazy(() => import('./modules/tableTemplate'));

const Routes = () => (
  <>
    <SideBar />
    <Suspense fallback={<LoadingIcon />}>
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
          <AsyncMetadata path="metadata/*" />
          <AsyncTableTemplate path="template/*" />
          <PageNotFound default />
        </Authorized>
        <Login path="/login" redirectUrl="/order" />
        <NoPermission path="/403" />
        <PageNotFound default />
      </Router>
    </Suspense>
  </>
);

export default hot(module)(Routes);
