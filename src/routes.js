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
  /* $FlowFixMe: ignore this error with loadable ops parameter */
  Loadable({
    loader,
    loading: () => <LoadingIcon />,
  });

const AsyncProduct = LoadableComponent(() => import('./modules/product'));
const AsyncOrder = LoadableComponent(() => import('./modules/order'));

const Routes = () => (
  <Router>
    <Authorized path="/">
      <DashBoard path="/" />
      <AsyncOrder path="order/*" />
      <AsyncProduct path="product/*" />
      <PageNotFound default />
    </Authorized>
    <Login path="/login" redirectUrl="/order" />
    <PageNotFound default />
  </Router>
);

export default hot(module)(Routes);
