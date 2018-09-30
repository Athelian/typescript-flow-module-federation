// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Mutation, Query } from 'react-apollo';

import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';

import LogoutDialog from 'components/Dialog/LogoutDialog';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { AuthenticationConsumer } from 'modules/authentication';

import { getByPathWithDefault } from 'utils/fp';
import Notifications from './notifications';

import logOutMutation from './mutation';
import query from './query';

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

    return (
      <div className={SettingsWrapperStyle}>
        <Query query={query}>
          {({ data }) => {
            const viewer = {
              firstName: getByPathWithDefault('TODO', 'viewer.user.firstName', data),
              lastName: getByPathWithDefault('TODO', 'viewer.user.lastName', data),
            };
            const unRead = getByPathWithDefault(0, 'viewer.notificationUnread', data);

            return (
              <>
                <button
                  className={NotificationButtonStyle}
                  tabIndex={-1}
                  onClick={this.toggleNotification}
                  type="button"
                  ref={this.NotificationRef}
                >
                  <div className={NotificationBadgeStyle}>{unRead > 99 ? '99+' : unRead}</div>
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
                  <UserAvatar firstName={viewer.firstName} lastName={viewer.lastName} />
                </button>
              </>
            );
          }}
        </Query>

        {isNotificationOpen && (
          <OutsideClickHandler
            onOutsideClick={this.handleClickOutside}
            ignoreElements={[this.NotificationRef && this.NotificationRef.current]}
          >
            <div className={NotificationDropDownWrapperStyle}>
              <div className={SubMenuWrapperStyle}>
                <Notifications toggleNotification={this.toggleNotification} />
              </div>
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
              mutation={logOutMutation}
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
