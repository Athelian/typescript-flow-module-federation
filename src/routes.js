// @flow

import React, { lazy, Suspense } from 'react';
import type { ComponentType, StatelessFunctionalComponent } from 'react';
import { hot } from 'react-hot-loader';
import { Router } from '@reach/router';
import UserProvider from 'modules/user';
import { AuthenticationConsumer } from 'modules/authentication';
import LoadingIcon from './components/LoadingIcon';
import PageNotFound from './components/PageNotFound';
import DashBoard from './modules/dashboard';
import Order from './modules/order';
import Login from './modules/login';
import SideBar from './modules/sidebar';
import Authorized from './components/Authorized';

const AsyncTags = lazy(() => import('./modules/tags'));

const AsyncStaff = lazy(() => import('./modules/staff'));

const AsyncPartner = lazy(() => import('./modules/partner'));

const AsyncWarehouse = lazy(() => import('./modules/warehouse'));

const AsyncShipment = lazy(() => import('./modules/shipment'));

const AsyncContainer = lazy(() => import('./modules/container'));

const AsyncProduct = lazy(() => import('./modules/product'));

const AsyncBatch = lazy(() => import('./modules/batch'));

const AsyncRelationMap = lazy(() => import('./modules/relationMap'));

const AsyncNotifications = lazy(() => import('./modules/notifications'));

const AsyncMetadata = lazy(() => import('./modules/metadata'));

const AsyncTableTemplate = lazy(() => import('./modules/tableTemplate'));

const AsyncTask = lazy(() => import('./modules/task'));

const AsyncTaskTemplate = lazy(() => import('./modules/taskTemplate'));

const Routes: StatelessFunctionalComponent<{}> = () => (
  <>
    <AuthenticationConsumer>
      {({ authenticated }) =>
        authenticated && (
          <UserProvider>
            <SideBar />
          </UserProvider>
        )
      }
    </AuthenticationConsumer>
    <Suspense fallback={<LoadingIcon />}>
      <Router>
        <Authorized path="/">
          <DashBoard path="/" />
          <Order path="order/*" />
          <AsyncBatch path="batch/*" />
          <AsyncShipment path="shipment/*" />
          <AsyncContainer path="container/*" />
          <AsyncProduct path="product/*" />
          <AsyncWarehouse path="warehouse/*" />
          <AsyncPartner path="partner/*" />
          <AsyncStaff path="staff/*" />
          <AsyncTask path="task/*" />
          <AsyncRelationMap path="relation-map/*" />
          <AsyncNotifications path="notifications/*" />
          <AsyncTags path="settings/tags/*" />
          <AsyncMetadata path="settings/metadata/*" />
          <AsyncTableTemplate path="settings/table-template/*" />
          <AsyncTaskTemplate path="settings/task-template/*" />
          <PageNotFound default />
        </Authorized>
        <Login path="/login" />
        <PageNotFound path="/403" />
        <PageNotFound default />
      </Router>
    </Suspense>
  </>
);

const HotReloadRoutes: ComponentType<any> = hot(module)(Routes);
export default HotReloadRoutes;
