// @flow
import * as React from 'react';
import apolloClient from 'apollo';
import { navigate } from '@reach/router';
import { BooleanValue } from 'react-values';
import { FormattedMessage } from 'react-intl';
import { Mutation } from 'react-apollo';
import Icon from 'components/Icon';
import LogoutDialog from 'components/Dialog/LogoutDialog';
import { AuthenticatedConsumer } from 'components/Context/Viewer';
import { logOutMutation } from 'modules/userNavbar/mutation';
import messages from 'modules/userNavbar/messages';
import Import from 'modules/import';
import { isEnableBetaFeature } from 'utils/env';
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

const UserMenuDropdown = ({ isOpen, toggleUserMenu }: Props) => {
  const [importOpen, setImportOpen] = React.useState(false);

  return (
    <div className={UserMenuDropDownWrapperStyle(isOpen, isEnableBetaFeature)}>
      <BooleanValue>
        {({ value: isLogoutDialogOpen, set: logoutDialogToggle }) => (
          <>
            <button
              className={UserMenuItemWrapperStyle}
              onClick={() => {
                navigate('/profile');
                toggleUserMenu();
              }}
              type="button"
            >
              <div className={UserMenuItemStyle}>
                <FormattedMessage {...messages.profile} />
              </div>
              <div className={UserMenuItemIconStyle}>
                <Icon icon="PROFILE" />
              </div>
            </button>

            {isEnableBetaFeature && (
              <button
                className={UserMenuItemWrapperStyle}
                onClick={() => {
                  toggleUserMenu();
                  setImportOpen(true);
                }}
                type="button"
              >
                <div className={UserMenuItemStyle}>
                  <FormattedMessage {...messages.import} />
                </div>
                <div className={UserMenuItemIconStyle}>
                  <Icon icon="IMPORT" />
                </div>
              </button>
            )}

            <button
              className={UserMenuItemWrapperStyle}
              onClick={() => {
                logoutDialogToggle(true);
                toggleUserMenu();
              }}
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

            <AuthenticatedConsumer>
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
                    apolloClient.clearStore();
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
            </AuthenticatedConsumer>
          </>
        )}
      </BooleanValue>

      <Import open={importOpen} onRequestClose={() => setImportOpen(false)} />
    </div>
  );
};

export default UserMenuDropdown;
