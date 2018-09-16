// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Mutation } from 'react-apollo';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import LogoutDialog from 'components/Dialog/LogoutDialog';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { AuthenticationConsumer } from 'modules/authentication';
import query from './mutation.graphql';
import {
  SettingsWrapperStyle,
  NotificationButtonStyle,
  ProfileButtonStyle,
  NotificationBadgeStyle,
  NotificationDropDownWrapperStyle,
  DropDownWrapperStyle,
  SubMenuWrapperStyle,
  SubMenuItemStyle,
} from './style';
import messages from './messages';

type Props = {};

type State = {
  isNotificationOpen: boolean,
  isProfileOpen: boolean,
  logoutDialogOpen: boolean,
};

class Setting extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      isNotificationOpen: false,
      isProfileOpen: false,
      logoutDialogOpen: false,
    };
    this.NotificationRef = React.createRef();
    this.ProfileRef = React.createRef();
  }

  handleClickOutside = () => {
    const { isNotificationOpen, isProfileOpen } = this.state;

    if (isNotificationOpen) {
      this.toggleNotification();
    } else if (isProfileOpen) {
      this.toggleProfile();
    }
  };

  toggleNotification = () => {
    this.setState(prevState => ({
      isNotificationOpen: !prevState.isNotificationOpen,
      isProfileOpen: false,
    }));
  };

  toggleProfile = () => {
    this.setState(prevState => ({
      isProfileOpen: !prevState.isProfileOpen,
      isNotificationOpen: false,
    }));
  };

  toggleLogoutDialog = () => {
    this.setState(prevState => ({ logoutDialogOpen: !prevState.logoutDialogOpen }));
  };

  NotificationRef: any;

  ProfileRef: any;

  render() {
    const { isNotificationOpen, isProfileOpen, logoutDialogOpen } = this.state;
    const DUMMY_BADGE = 3;
    const DUMMY_USER = {
      firstName: 'TODO',
      lastName: 'TODO',
    };

    return (
      <div className={SettingsWrapperStyle}>
        <button
          className={NotificationButtonStyle}
          tabIndex={-1}
          onClick={this.toggleNotification}
          type="button"
          ref={this.NotificationRef}
        >
          <div className={NotificationBadgeStyle}>{DUMMY_BADGE > 99 ? '99+' : DUMMY_BADGE}</div>
          <Icon icon="NOTIFICATION" />
        </button>

        <button
          className={ProfileButtonStyle}
          data-testid="setting-button"
          tabIndex={-1}
          onClick={this.toggleProfile}
          type="button"
          ref={this.ProfileRef}
        >
          <UserAvatar firstName={DUMMY_USER.firstName} lastName={DUMMY_USER.lastName} />
        </button>

        {isNotificationOpen && (
          <OutsideClickHandler
            onOutsideClick={this.handleClickOutside}
            ignoreElements={[this.NotificationRef && this.NotificationRef.current]}
          >
            <div className={NotificationDropDownWrapperStyle}>
              <div className={SubMenuWrapperStyle}>There is nothing to notice you.</div>
            </div>
          </OutsideClickHandler>
        )}

        {isProfileOpen && (
          <OutsideClickHandler
            onOutsideClick={this.handleClickOutside}
            ignoreElements={[this.ProfileRef && this.ProfileRef.current]}
          >
            <div className={DropDownWrapperStyle}>
              <div className={SubMenuWrapperStyle}>
                <div className={SubMenuItemStyle}>
                  <div>
                    <Icon icon="PROFILE" />
                  </div>
                  <div>
                    <FormattedMessage {...messages.profile} />
                  </div>
                </div>
                <div className={SubMenuItemStyle}>
                  <div>
                    <Icon icon="SETTINGS" />
                  </div>
                  <div>
                    <FormattedMessage {...messages.preferences} />
                  </div>
                </div>
                <div
                  className={SubMenuItemStyle}
                  onClick={this.toggleLogoutDialog}
                  data-testid="logout-button"
                  role="presentation"
                >
                  <div>
                    <Icon icon="LOGOUT" />
                  </div>
                  <div>
                    <FormattedMessage {...messages.logout} />
                  </div>
                </div>
              </div>
            </div>
          </OutsideClickHandler>
        )}

        <AuthenticationConsumer>
          {({ setAuthenticated }) => (
            <Mutation
              mutation={query}
              onCompleted={() => {
                setAuthenticated(false);
              }}
            >
              {logout => (
                <LogoutDialog
                  isOpen={logoutDialogOpen}
                  onRequestClose={this.toggleLogoutDialog}
                  onCancel={this.toggleLogoutDialog}
                  onConfirm={() => {
                    logout({});
                  }}
                />
              )}
            </Mutation>
          )}
        </AuthenticationConsumer>
      </div>
    );
  }
}

export default Setting;
