// @flow
import * as React from 'react';
import { Location, Redirect } from '@reach/router';
import { isAuthenticated } from 'utils/auth';
import UserProvider from 'modules/user';

type Props = {
  children: React.Node,
};

const Authorized = ({ children }: Props) =>
  isAuthenticated() ? (
    <UserProvider>{children}</UserProvider>
  ) : (
    <Location>
      {({ location }) => <Redirect from={location.pathname} to="login" noThrow />}
    </Location>
  );

export default Authorized;
