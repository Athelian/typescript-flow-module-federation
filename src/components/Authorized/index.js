// @flow
import * as React from 'react';
import { Location, Redirect } from '@reach/router';
import { isAuthenticated } from 'utils/auth';

type Props = {
  children: React.Node,
};

const Authorized = ({ children }: Props) =>
  isAuthenticated() ? (
    children
  ) : (
    <Location>
      {({ location }) => <Redirect from={location.pathname} to="login" noThrow />}
    </Location>
  );

export default Authorized;
