// @flow
import * as React from 'react';
import * as Sentry from '@sentry/browser';
import { Query } from 'react-apollo';
import { LanguageConsumer } from 'modules/language';
import { FullStoryAPI } from 'react-fullstory';
import LoadingIcon from 'components/LoadingIcon';
import { isAppInProduction } from 'utils/env';
import { getByPathWithDefault } from 'utils/fp';
import { PermissionProvider } from 'modules/permission';
import query from './query';

type ContextProps = {
  user: {
    id: string,
    organization: Object,
    firstName: string,
    lastName: string,
  },
  permissions: Array<string>,
};

export const UserContext: React.Context<ContextProps> = React.createContext({
  user: {
    id: '-1',
    organization: {
      id: '-1',
    },
    firstName: '',
    lastName: '',
  },
  permissions: [],
});

type Props = {
  children: React.Node,
};

const UserProvider = ({ children }: Props) => (
  <LanguageConsumer>
    {({ setLocale }) => (
      <Query
        query={query}
        fetchPolicy="network-only"
        onCompleted={result => {
          const {
            viewer: {
              user: { language },
            },
          } = result;
          setLocale(language);
        }}
      >
        {({ loading, data, error }) => {
          if (error) {
            return error.message;
          }

          if (loading) return <LoadingIcon />;
          const {
            user = {
              id: '-1',
              organization: {
                id: '-1',
                types: [],
              },
              email: '',
              firstName: '',
              lastName: '',
              language: 'en',
              role: 'manager',
            },
            permissions = [],
          } = getByPathWithDefault({}, 'viewer', data);

          const { email, id, firstName, lastName } = user;

          Sentry.configureScope(scope => {
            scope.setUser({ email, id });
          });

          if (window && window.smartlook) {
            window.smartlook('identify', id, {
              email,
              name: `${lastName} ${firstName}`,
            });
          }

          if (window && window.LogRocket) {
            window.LogRocket.identify(id, {
              email,
              name: `${lastName} ${firstName}`,
            });
          }

          if (isAppInProduction) {
            FullStoryAPI('identify', id, {
              name: `${lastName} ${firstName}`,
              email,
            });
          }

          return (
            <UserContext.Provider value={{ user, permissions }}>
              <PermissionProvider permissions={permissions}>{children}</PermissionProvider>
            </UserContext.Provider>
          );
        }}
      </Query>
    )}
  </LanguageConsumer>
);

export const UserConsumer = UserContext.Consumer;

export default UserProvider;
