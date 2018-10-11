// @flow
import * as React from 'react';
import Raven from 'raven-js';
import { Query } from 'react-apollo';
import { LanguageConsumer } from 'modules/language';
import { FullStoryAPI } from 'react-fullstory';
import Intercom from 'react-intercom';
import LoadingIcon from 'components/LoadingIcon';
import { isAppInProduction } from 'utils/env';
import { getByPathWithDefault } from 'utils/fp';
import query from './query';

const UserContext = React.createContext({
  user: {
    id: -1,
  },
  permissions: [],
});

type Props = {
  children: React.Node,
};

const UserProvider = ({ children }: Props) => (
  <LanguageConsumer>
    {({ setLocale }) => (
      <Query query={query}>
        {({ loading, data, error }) => {
          if (error) {
            return error.message;
          }

          if (loading) return <LoadingIcon />;
          const { user, permissions } = getByPathWithDefault({}, 'viewer', data);

          const { email, id, firstName, lastName, language } = user;
          const userProfile = {
            id,
            email,
            name: `${lastName} ${firstName}`,
          };
          Raven.setUserContext({ email, id });
          if (isAppInProduction) {
            FullStoryAPI('identify', id, {
              name: `${lastName} ${firstName}`,
              email,
            });
          }

          if (language === 'jp') {
            setLocale('ja');
          } else {
            setLocale('en');
          }

          return (
            <UserContext.Provider value={{ user, permissions }}>
              {children}
              {isAppInProduction && (
                <Intercom appID={process.env.ZENPORT_INTERCOM_ID} {...userProfile} />
              )}
            </UserContext.Provider>
          );
        }}
      </Query>
    )}
  </LanguageConsumer>
);

export const UserConsumer = UserContext.Consumer;

export default UserProvider;
