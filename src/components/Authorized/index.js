// @flow
import * as React from 'react';
import { Location, Redirect } from '@reach/router';
import UserProvider from 'modules/user';
import { useAuthenticated } from 'components/Context/Authenticated';

type Props = {
  children: React.Node,
};

const Authorized = ({ children }: Props) => {
  const { authenticated } = useAuthenticated();

  return authenticated ? (
    <UserProvider>{children}</UserProvider>
  ) : (
    <Location>
      {({ location }) => <Redirect from={location.pathname} to="login" noThrow />}
    </Location>
  );
};

export default Authorized;
