// @flow
import * as React from 'react';
import { Location, Redirect } from '@reach/router';
import { useAuthenticated } from 'components/Context/Viewer';

type Props = {
  children: React.Node,
};

const Authorized = ({ children }: Props) => {
  const { authenticated } = useAuthenticated();

  return authenticated ? (
    children
  ) : (
    <Location>
      {({ location }) => <Redirect from={location.pathname} to="login" noThrow />}
    </Location>
  );
};

export default Authorized;
