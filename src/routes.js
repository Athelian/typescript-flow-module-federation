// @flow
import React, { lazy, Suspense } from 'react';
import type { ComponentType, StatelessFunctionalComponent } from 'react';
import { hot } from 'react-hot-loader';
import { Router } from '@reach/router';
import { useAuthenticated } from './contexts/Viewer';
import { useUI } from './contexts/UI';
import { Layout } from './components/Layout';
import LoadingIcon from './components/LoadingIcon';
import Page from './components/Page';
import PageNotFound from './components/PageNotFound';
import DashBoard from './modules/dashboard';
import SideBar from './components/SideBar';
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
const AsyncNotifications = lazy(() => import('./modules/notifications'));
const AsyncMetadata = lazy(() => import('./modules/metadata'));
const AsyncTableTemplate = lazy(() => import('./modules/tableTemplate'));
const AsyncTask = lazy(() => import('./modules/task'));
const AsyncProject = lazy(() => import('./modules/project'));
const AsyncTaskTemplate = lazy(() => import('./modules/taskTemplate'));
const AsyncProjectTemplate = lazy(() => import('./modules/projectTemplate'));
const AsyncProfile = lazy(() => import('./modules/profile'));
const AsyncDocument = lazy(() => import('./modules/document'));

const Routes: StatelessFunctionalComponent<{}> = () => {
  const { authenticated } = useAuthenticated();
  const uiState = useUI();

  return (
    <>
      {authenticated && <SideBar />}
      <Suspense fallback={<LoadingIcon />}>
        <Router>
          <Authorized path="/">
            <Layout {...uiState} path="/">
              <DashBoard path="/" default />
              <Page Component={AsyncOrder} path="order/*" />
              <Page Component={AsyncOrderItem} path="order-item/*" />
              <Page Component={AsyncBatch} path="batch/*" />
              <Page Component={AsyncShipment} path="shipment/*" />
              <Page Component={AsyncContainer} path="container/*" />
              <Page Component={AsyncProduct} path="product/*" />
              <Page Component={AsyncWarehouse} path="warehouse/*" />
              <Page Component={AsyncPartner} path="partner/*" />
              <Page Component={AsyncStaff} path="staff/*" />
              <Page Component={AsyncProject} path="project/*" />
              <Page Component={AsyncTask} path="task/*" />
              <Page Component={AsyncNotifications} path="notifications/*" />
              <Page Component={AsyncTags} path="tags/*" />
              <Page Component={AsyncMetadata} path="templates/metadata/*" />
              <Page Component={AsyncTableTemplate} path="templates/table-template/*" />
              <Page Component={AsyncTaskTemplate} path="templates/task-template/*" />
              <Page Component={AsyncProjectTemplate} path="templates/project/*" />
              <Page Component={AsyncProfile} path="profile/*" />
              <Page Component={AsyncDocument} path="document/*" />
            </Layout>
          </Authorized>
          <AsyncLogin path="/login" />
          <AsyncForgotPassword path="/forgot-password" />
          <AsyncResetPassword path="/reset-password/:token" />
          <PageNotFound path="/403" />
        </Router>
      </Suspense>
    </>
  );
};

const HotReloadRoutes: ComponentType<any> = hot(module)(Routes);
export default HotReloadRoutes;
