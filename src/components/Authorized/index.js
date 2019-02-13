// @flow
import * as React from 'react';
import { Location, Redirect } from '@reach/router';
import { PermissionProvider } from 'modules/permission';
import UserProvider from 'modules/user';
import { AuthenticationConsumer } from 'modules/authentication';

type Props = {
  children: React.Node,
};

const Authorized = ({ children }: Props) => (
  <AuthenticationConsumer>
    {({ authenticated }) =>
      authenticated ? (
        <PermissionProvider>
          <UserProvider>{children}</UserProvider>
        </PermissionProvider>
      ) : (
        <Location>
          {({ location }) => <Redirect from={location.pathname} to="login" noThrow />}
        </Location>
      )
    }
  </AuthenticationConsumer>
);

export default Authorized;
