// @flow
import * as React from 'react';
import { Location, Redirect } from '@reach/router';
import UserProvider from 'modules/user';
import { AuthenticationConsumer } from 'components/Authenticated';

type Props = {
  children: React.Node,
};

const Authorized = ({ children }: Props) => (
  <AuthenticationConsumer>
    {({ authenticated }) =>
      authenticated ? (
        <UserProvider>{children}</UserProvider>
      ) : (
        <Location>
          {({ location }) => <Redirect from={location.pathname} to="login" noThrow />}
        </Location>
      )
    }
  </AuthenticationConsumer>
);

export default Authorized;
