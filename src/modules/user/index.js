// @flow
import * as React from 'react';
import * as Sentry from '@sentry/browser';
import { Query } from 'react-apollo';
import { LanguageConsumer } from 'modules/language';
import { FullStoryAPI } from 'react-fullstory';
import Intercom from 'react-intercom';
import LoadingIcon from 'components/LoadingIcon';
import { isAppInProduction } from 'utils/env';
import { getByPathWithDefault } from 'utils/fp';
import { PermissionProvider } from 'modules/permission';
import query from './query';

type ContextProps = {
  user: {
    id: string,
    group: Object,
  },
  permissions: Array<string>,
};

const UserContext: React.Context<ContextProps> = React.createContext({
  user: {
    id: '-1',
    group: {},
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
          if (['ja', 'jp'].includes(language)) {
            setLocale('ja');
          } else {
            setLocale('en');
          }
        }}
      >
        {({ loading, data, error }) => {
          if (error) {
            return error.message;
          }

          if (loading) return <LoadingIcon />;
          const {
            user = {
              email: '',
              id: '-1',
              firstName: '',
              lastName: '',
              language: 'en',
              role: 'manager',
              group: {
                types: [],
              },
            },
            permissions = [],
          } = getByPathWithDefault({}, 'viewer', data);

          const { email, id, firstName, lastName } = user;
          const userProfile = {
            id,
            email,
            name: `${lastName} ${firstName}`,
          };
          Sentry.configureScope(scope => {
            scope.setUser({ email, id });
          });

          if (isAppInProduction) {
            FullStoryAPI('identify', id, {
              name: `${lastName} ${firstName}`,
              email,
            });
          }

          return (
            <UserContext.Provider value={{ user, permissions }}>
              <PermissionProvider permissions={permissions}>
                {children}
                {isAppInProduction && (
                  <Intercom appID={process.env.ZENPORT_INTERCOM_ID} {...userProfile} />
                )}
              </PermissionProvider>
            </UserContext.Provider>
          );
        }}
      </Query>
    )}
  </LanguageConsumer>
);

export const UserConsumer = UserContext.Consumer;

export default UserProvider;
