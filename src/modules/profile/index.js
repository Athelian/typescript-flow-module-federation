// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Match, navigate, Redirect, Router } from '@reach/router';
import { Provider } from 'unstated';
import { UIConsumer } from 'modules/ui';
import { Layout } from 'components/Layout';
import NavBar, { EntityIcon } from 'components/NavBar';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import ProfileSecurity from './index.security';

export default function ProfileModule() {
  return (
    <Provider>
      <UIConsumer>
        {uiState => (
          <Layout
            {...uiState}
            navBar={
              <NavBar>
                <EntityIcon icon="PROFILE" color="TEMPLATE" invert />
                <Match path="/profile/security">
                  {({ match }) => (
                    <TabItem
                      active={!!match}
                      label={
                        <FormattedMessage id="modules.profile.security" defaultMessage="SECURITY" />
                      }
                      icon="SECURITY"
                      onClick={() => !match && navigate('/profile/security')}
                    />
                  )}
                </Match>
              </NavBar>
            }
          >
            <Router>
              {/* $FlowFixMe path prop is necessary or breaks hot reload */}
              <Redirect path="/" from="/" to="/profile/security" noThrow />
              <ProfileSecurity path="/security" />
            </Router>
          </Layout>
        )}
      </UIConsumer>
    </Provider>
  );
}
