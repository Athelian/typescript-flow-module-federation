// @flow
import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AppWrapperStyle } from 'styles/main';
import { isAuthenticated } from 'utils/auth';

type Props = {
  component: React.ComponentType<any>,
  ...any,
};

const AuthorizedRoute = ({ component: Component, ...rest }: Props) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <div className={AppWrapperStyle}>
          <Component {...props} />
        </div>
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

export default AuthorizedRoute;
