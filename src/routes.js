// @flow
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { Router } from '@reach/router';
import Loadable from 'react-loadable';
import LoadingIcon from './components/LoadingIcon';
import Login from './modules/login';
import DashBoard from './modules/dashboard';
import Layout from './components/Layout';

const LoadableComponent = loader =>
  Loadable({
    loader,
    loading: () => <LoadingIcon />,
  });

const PageNotFound = LoadableComponent(() => import('./components/PageNotFound'));
const AsyncOrder = LoadableComponent(() => import('./modules/order'));
const AsyncProduct = LoadableComponent(() => import('./modules/product'));

const Routes = () => (
  <Router>
    <Layout path="/">
      <DashBoard path="/" />
      <AsyncOrder path="order/*" />
      <AsyncProduct path="product/*" />
      <PageNotFound default />
    </Layout>
    <Login path="/login" />
    <PageNotFound default />
  </Router>
);

export default hot(module)(Routes);
