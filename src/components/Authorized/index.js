// @flow
import * as React from 'react';
import { Location, Redirect } from '@reach/router';
import { EnumsProvider } from 'providers/enums';
import UserProvider from 'modules/user';
import { AuthenticationConsumer } from 'modules/authentication';

type Props = {
  children: React.Node,
};

const Authorized = ({ children }: Props) => (
  <AuthenticationConsumer>
    {({ authenticated }) =>
      authenticated ? (
        // FIXME: where is better?
        <EnumsProvider>
          <UserProvider>{children}</UserProvider>
        </EnumsProvider>
      ) : (
        <Location>
          {({ location }) => <Redirect from={location.pathname} to="login" noThrow />}
        </Location>
      )
    }
  </AuthenticationConsumer>
);

export default Authorized;
