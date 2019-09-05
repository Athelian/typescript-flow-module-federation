// @flow
import * as React from 'react';
import * as Sentry from '@sentry/browser/dist/index';
import { useApolloClient } from '@apollo/react-hooks';
import { FullStoryAPI } from 'react-fullstory';
import LoadingIcon from 'components/LoadingIcon';
import { isAppInProduction } from 'utils/env';
import { authenticationQuery, viewerQuery } from './query';

type User = {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  language: string,
  timezone: string,
};

type Organization = {
  id: string,
  name: string,
  name2: string,
  types: Array<string>,
};

type AuthenticatedContext = {
  authenticated: boolean,
  setAuthenticated: boolean => void,
};

type Context = {
  user: User | null,
  organization: Organization | null,
} & AuthenticatedContext;

type AuthorizedContext = {
  user: User,
  organization: Organization,
} & AuthenticatedContext;

const initialState = {
  user: null,
  organization: null,
};

export const ViewerContext = React.createContext<Context>({
  ...initialState,
  authenticated: false,
  setAuthenticated: () => {},
});

export const useViewer = (): Context => React.useContext(ViewerContext);

export const useAuthorizedViewer = (): AuthorizedContext => {
  const { user, organization, authenticated, setAuthenticated } = useViewer();
  if (!authenticated || user === null || organization === null) {
    throw new Error('Viewer is not authorized!');
  }

  return {
    user,
    organization,
    authenticated,
    setAuthenticated,
  };
};

export const useAuthenticated = (): AuthenticatedContext => {
  const { authenticated, setAuthenticated } = useViewer();

  return { authenticated, setAuthenticated };
};

type Props = {
  children: React.Node,
};

const ViewerProvider = ({ children }: Props) => {
  const client = useApolloClient();
  const [loadingAuth, setLoadingAuth] = React.useState(true);
  const [loadingViewer, setLoadingViewer] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [viewer, setViewer] = React.useState(initialState);

  React.useEffect(() => {
    client
      .query({
        query: authenticationQuery,
        fetchPolicy: 'network-only',
      })
      .then(({ data }) => {
        setAuthenticated(data?.authenticated ?? false);
        setLoadingViewer(data?.authenticated ?? false);
        setLoadingAuth(false);
      });
  }, [setAuthenticated, setLoadingAuth]);

  React.useEffect(() => {
    if (!authenticated) {
      setViewer(initialState);
      return;
    }

    setLoadingViewer(true);

    client
      .query({
        query: viewerQuery,
        fetchPolicy: 'network-only',
      })
      .then(({ data }) => {
        const { user } = data.viewer;
        const { organization, ...userRest } = user;

        setViewer({
          user: userRest,
          organization,
        });
        setLoadingViewer(false);
      });
  }, [authenticated, setViewer, setLoadingViewer]);

  React.useEffect(() => {
    if (!viewer.user) {
      if (window && window.smartlook) {
        window.smartlook('identify', 'anonymize');
      }

      if (isAppInProduction) {
        FullStoryAPI('identify', false);
      }

      return;
    }

    const { email, id, firstName, lastName } = viewer.user;
    Sentry.configureScope(scope => {
      scope.setUser({ email, id });
    });

    if (window && window.smartlook) {
      window.smartlook('identify', id, {
        email,
        name: `${lastName} ${firstName}`,
      });
    }

    if (isAppInProduction) {
      FullStoryAPI('identify', id, {
        email,
        displayName: `${lastName} ${firstName}`,
      });
    }
  }, [viewer.user]);

  return (
    <ViewerContext.Provider
      value={{
        ...viewer,
        authenticated: authenticated && !!viewer.user && !!viewer.organization,
        setAuthenticated,
      }}
    >
      {loadingAuth || loadingViewer ? <LoadingIcon /> : children}
    </ViewerContext.Provider>
  );
};

/**
 * @deprecated Use useAuthenticated hook instead
 */
export const AuthenticatedConsumer = ({
  children,
}: {
  children: AuthenticatedContext => React.Node,
}) => {
  return children(useAuthenticated());
};

/**
 * @deprecated Use hook `useAuthorizedViewer` instead.
 */
export const UserConsumer = ({ children }: { children: AuthorizedContext => React.Node }) => {
  return children(useAuthorizedViewer());
};

export default ViewerProvider;
