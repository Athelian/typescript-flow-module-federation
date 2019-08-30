// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import query from './query';

type Context = {
  authenticated: boolean,
  setAuthenticated: boolean => void,
};

export const AuthenticatedContext: React.Context<Context> = React.createContext({
  authenticated: false,
  setAuthenticated: () => {},
});

export const useAuthenticated = (): Context => React.useContext(AuthenticatedContext);

type Props = {
  children: React.Node,
};

const AuthenticatedProvider = ({ children }: Props) => {
  const { data, loading, updateQuery } = useQuery(query, {
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return null;
  }

  return (
    <AuthenticatedContext.Provider
      value={{
        authenticated: data?.authenticated ?? false,
        setAuthenticated: (authenticated: boolean) => {
          updateQuery(() => ({ authenticated }));
        },
      }}
    >
      {children}
    </AuthenticatedContext.Provider>
  );
};

/**
 * @deprecated Use useAuthenticated hook instead
 */
export const AuthenticationConsumer = AuthenticatedContext.Consumer;

export default AuthenticatedProvider;
