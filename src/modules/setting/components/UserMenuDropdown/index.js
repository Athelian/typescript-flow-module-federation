// @flow
import * as React from 'react';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { Mutation } from 'react-apollo';
import Icon from 'components/Icon';
import { AuthenticationConsumer } from 'modules/authentication';
import LogoutDialog from 'components/Dialog/LogoutDialog';
import { logOutMutation } from 'modules/setting/mutation';
import {
  UserMenuDropDownWrapperStyle,
  UserMenuItemWrapperStyle,
  UserMenuItemIconStyle,
  UserMenuItemStyle,
} from './style';
import messages from '../../messages';

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

  render() {
    const { isOpen } = this.props;

    return (
      <div className={UserMenuDropDownWrapperStyle(isOpen)}>
        <BooleanValue>
          {({ value: isLogoutDialogOpen, set: logoutDialogToggle }) => (
            <>
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
                    }}
                  >
                    {logout => (
                      <LogoutDialog
                        isOpen={isLogoutDialogOpen}
                        onRequestClose={() => logoutDialogToggle(false)}
                        onCancel={() => logoutDialogToggle(false)}
                        onConfirm={() => {
                          logout({});
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
