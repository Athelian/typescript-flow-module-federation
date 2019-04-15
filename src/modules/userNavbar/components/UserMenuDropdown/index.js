// @flow
import * as React from 'react';
import apolloClient from 'apollo';
import { navigate } from '@reach/router';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { Mutation } from 'react-apollo';
import Icon from 'components/Icon';
import { AuthenticationConsumer } from 'modules/authentication';
import LogoutDialog from 'components/Dialog/LogoutDialog';
import { logOutMutation } from 'modules/userNavbar/mutation';
import messages from 'modules/userNavbar/messages';
import {
  UserMenuDropDownWrapperStyle,
  UserMenuItemWrapperStyle,
  UserMenuItemIconStyle,
  UserMenuItemStyle,
} from './style';

type Props = {
  isOpen: boolean,
  toggleUserMenu: Function,
};

class UserMenuDropdown extends React.Component<Props> {
  handleLogout = (logoutDialogToggle: Function) => {
    const { toggleUserMenu } = this.props;
    logoutDialogToggle(true);
    toggleUserMenu();
  };

  handleProfile = () => {
    const { toggleUserMenu } = this.props;
    navigate('/profile');
    toggleUserMenu();
  };

  render() {
    const { isOpen } = this.props;

    return (
      <div className={UserMenuDropDownWrapperStyle(isOpen)}>
        <BooleanValue>
          {({ value: isLogoutDialogOpen, set: logoutDialogToggle }) => (
            <>
              <button
                className={UserMenuItemWrapperStyle}
                onClick={() => this.handleProfile()}
                type="button"
              >
                <div className={UserMenuItemStyle}>
                  <FormattedMessage {...messages.profile} />
                </div>
                <div className={UserMenuItemIconStyle}>
                  <Icon icon="PROFILE" />
                </div>
              </button>

              <button
                className={UserMenuItemWrapperStyle}
                onClick={() => this.handleLogout(logoutDialogToggle)}
                data-testid="logout-button"
                type="button"
              >
                <div className={UserMenuItemStyle}>
                  <FormattedMessage {...messages.logout} />
                </div>
                <div className={UserMenuItemIconStyle}>
                  <Icon icon="LOGOUT" />
                </div>
              </button>

              <AuthenticationConsumer>
                {({ setAuthenticated }) => (
                  <Mutation
                    mutation={logOutMutation}
                    onCompleted={() => {
                      setAuthenticated(false);
                      // clear all cache after logout
                      if (window.localStorage) {
                        window.localStorage.clear();
                      }
                      // refer apollo client doc https://www.apollographql.com/docs/react/recipes/authentication#login-logouts
                      apolloClient.resetStore();
                    }}
                  >
                    {logout => (
                      <LogoutDialog
                        isOpen={isLogoutDialogOpen}
                        onRequestClose={() => logoutDialogToggle(false)}
                        onCancel={() => logoutDialogToggle(false)}
                        onConfirm={async () => {
                          await logout({});
                          navigate('/login');
                        }}
                      />
                    )}
                  </Mutation>
                )}
              </AuthenticationConsumer>
            </>
          )}
        </BooleanValue>
      </div>
    );
  }
}

export default UserMenuDropdown;
