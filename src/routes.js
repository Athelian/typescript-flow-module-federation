// @flow
import React, { lazy, Suspense } from 'react';
import type { ComponentType, StatelessFunctionalComponent } from 'react';
import { hot } from 'react-hot-loader';
import { Router } from '@reach/router';
import UserProvider from 'modules/user';
import { AuthenticationConsumer } from 'modules/authentication';
import { UIConsumer } from 'modules/ui';
import { Layout } from './components/Layout';
import LoadingIcon from './components/LoadingIcon';
import PageNotFound from './components/PageNotFound';
import DashBoard from './modules/dashboard';
import SideBar from './modules/sidebar';
import Authorized from './components/Authorized';

const AsyncLogin = lazy(() => import('./modules/login'));
const AsyncForgotPassword = lazy(() => import('./modules/forgotPassword'));
const AsyncResetPassword = lazy(() => import('./modules/resetPassword'));
const AsyncOrder = lazy(() => import('./modules/order'));
const AsyncOrderItem = lazy(() => import('./modules/orderItem'));
const AsyncTags = lazy(() => import('./modules/tags'));
const AsyncStaff = lazy(() => import('./modules/staff'));
const AsyncPartner = lazy(() => import('./modules/partner'));
const AsyncWarehouse = lazy(() => import('./modules/warehouse'));
const AsyncShipment = lazy(() => import('./modules/shipment'));
const AsyncContainer = lazy(() => import('./modules/container'));
const AsyncProduct = lazy(() => import('./modules/product'));
const AsyncBatch = lazy(() => import('./modules/batch'));
const AsyncRelationMap = lazy(() => import('./modules/relationMap'));
const AsyncRelationMapV2 = lazy(() => import('./modules/relationMapV2'));
const AsyncNotifications = lazy(() => import('./modules/notifications'));
const AsyncMetadata = lazy(() => import('./modules/metadata'));
const AsyncTableTemplate = lazy(() => import('./modules/tableTemplate'));
const AsyncTask = lazy(() => import('./modules/task'));
const AsyncProject = lazy(() => import('./modules/project'));
const AsyncTaskTemplate = lazy(() => import('./modules/taskTemplate'));
const AsyncProfile = lazy(() => import('./modules/profile'));
const AsyncDocument = lazy(() => import('./modules/document'));
const AsyncGlobalView = lazy(() => import('./modules/globalView'));
const AsyncSheet = lazy(() => import('./modules/sheet'));

const Routes: StatelessFunctionalComponent<{}> = () => (
  <UIConsumer>
    {uiState => (
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
              <Layout {...uiState} path="/">
                <DashBoard path="/" />
                <AsyncOrder path="order/*" />
                <AsyncOrderItem path="order-item/*" />
                <AsyncBatch path="batch/*" />
                <AsyncShipment path="shipment/*" />
                <AsyncContainer path="container/*" />
                <AsyncProduct path="product/*" />
                <AsyncWarehouse path="warehouse/*" />
                <AsyncPartner path="partner/*" />
                <AsyncStaff path="staff/*" />
                <AsyncProject path="project/*" />
                <AsyncTask path="task/*" />
                <AsyncRelationMap path="relation-map/*" />
                <AsyncRelationMapV2 path="relation-map-beta/*" />
                <AsyncNotifications path="notifications/*" />
                <AsyncTags path="tags/*" />
                <AsyncMetadata path="templates/metadata/*" />
                <AsyncTableTemplate path="templates/table-template/*" />
                <AsyncTaskTemplate path="templates/task-template/*" />
                <AsyncProfile path="profile/*" />
                <AsyncDocument path="document/*" />
                <AsyncGlobalView path="global-view" />
                <AsyncSheet path="sheet/*" />
                <PageNotFound default />
              </Layout>
            </Authorized>
            <AsyncLogin path="/login" />
            <AsyncForgotPassword path="/forgot-password" />
            <AsyncResetPassword path="/reset-password/:token" />
            <PageNotFound path="/403" />
            <PageNotFound default />
          </Router>
        </Suspense>
      </>
    )}
  </UIConsumer>
);
const HotReloadRoutes: ComponentType<any> = hot(module)(Routes);
export default HotReloadRoutes;
