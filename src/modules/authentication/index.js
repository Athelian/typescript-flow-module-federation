// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import query from './query';

type ContextProps = {
  authenticated: boolean,
  setAuthenticated: Function,
};

const AuthenticationContext: React.Context<ContextProps> = React.createContext({
  authenticated: false,
  setAuthenticated: authenticated => authenticated,
});

type Props = {
  children: React.Node,
};

const AuthenticationProvider = ({ children }: Props) => (
  <Query query={query} fetchPolicy="network-only">
    {({ data, loading, updateQuery }) =>
      loading ? null : (
        <AuthenticationContext.Provider
          value={{
            authenticated: getByPathWithDefault(false, 'authenticated', data),
            setAuthenticated: (authenticated: boolean) => {
              updateQuery(() => ({ authenticated }));
            },
          }}
        >
          {children}
        </AuthenticationContext.Provider>
      )
    }
  </Query>
);

export const AuthenticationConsumer = AuthenticationContext.Consumer;

export default AuthenticationProvider;
