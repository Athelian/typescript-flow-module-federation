// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { getByPathWithDefault } from 'utils/fp';
import query from './query.graphql';

type ContextProps = {
  authenticated: boolean,
  setAuthenticated: boolean => void,
};

const AuthenticationContext = React.createContext<ContextProps>({
  authenticated: false,
  setAuthenticated: () => {},
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
