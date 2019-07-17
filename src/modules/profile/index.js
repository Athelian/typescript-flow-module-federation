// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Match, navigate, Redirect, Router } from '@reach/router';
import { Provider } from 'unstated';
import { Content } from 'components/Layout';
import Portal from 'components/Portal';
import { EntityIcon } from 'components/NavBar';
import TabItem from 'components/NavBar/components/Tabs/components/TabItem';
import ProfileSecurity from './index.security';

export default function ProfileModule() {
  return (
    <Provider>
      <Content>
        <Portal>
          <EntityIcon icon="PROFILE" color="TEMPLATE" invert />
          <Match path="/profile/security">
            {({ match }) => (
              <TabItem
                active={!!match}
                label={<FormattedMessage id="modules.profile.security" defaultMessage="SECURITY" />}
                icon="SECURITY"
                onClick={() => !match && navigate('/profile/security')}
              />
            )}
          </Match>
        </Portal>
        <Router>
          {/* $FlowFixMe path prop is necessary or breaks hot reload */}
          <Redirect path="/" from="/" to="/profile/security" noThrow />
          <ProfileSecurity path="/security" />
        </Router>
      </Content>
    </Provider>
  );
}
