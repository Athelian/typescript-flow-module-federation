// @flow
import * as React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import AuthorizedRoute from 'components/AuthorizedRoute';
import Login from './modules/login';

const LoadableComponent = loader =>
  /* $FlowFixMe: fix later */
  Loadable({
    loader,
    loading: () => null,
  });

// Orders
const OrderList = LoadableComponent(() => import('./modules/order/list'));

// Error
const InternalError = LoadableComponent(() => import('./components/InternalError'));
const PageNotFound = LoadableComponent(() => import('./components/PageNotFound'));

const Routes = () => (
  <Router>
    {/* $FlowFixMe: React Flow typings are not updated to React 16.3 yet */}
    <React.StrictMode>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/internalError" component={InternalError} />
        <Redirect exact from="/" to="/order" />
        {/* order routes */}
        <AuthorizedRoute exact path="/order" component={OrderList} />
        <Route component={PageNotFound} />
      </Switch>
    </React.StrictMode>
  </Router>
);

export default hot(module)(Routes);
