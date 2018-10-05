// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Mutation, Query, Subscription } from 'react-apollo';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import LogoutDialog from 'components/Dialog/LogoutDialog';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { AuthenticationConsumer } from 'modules/authentication';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import Notifications from './notifications';
import { logOutMutation, notificationSeeAllMutation } from './mutation';
import query from './query';
import subscription from './subscription';

import {
  SettingsWrapperStyle,
  NotificationsButtonStyle,
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

    this.notificationRef = React.createRef();
    this.profileRef = React.createRef();
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

  notificationRef: any;

  profileRef: any;

  render() {
    const { isNotificationOpen, isProfileOpen, logoutDialogOpen } = this.state;

    return (
      <div className={SettingsWrapperStyle}>
        <Query query={query}>
          {({ data, client }) => {
            const viewer = {
              firstName: getByPathWithDefault('TODO', 'viewer.user.firstName', data),
              lastName: getByPathWithDefault('TODO', 'viewer.user.lastName', data),
            };
            const unSeen = getByPathWithDefault(0, 'viewer.notificationUnseen', data);

            return (
              <>
                <button
                  className={NotificationsButtonStyle}
                  tabIndex={-1}
                  onClick={async () => {
                    this.toggleNotification();
                    if (unSeen > 0)
                      await client.mutate({
                        mutation: notificationSeeAllMutation,
                      });
                  }}
                  type="button"
                  ref={this.notificationRef}
                >
                  <Subscription subscription={subscription}>
                    {({ data: subscriptionData, loading, error }) => {
                      if (loading) return null;

                      if (error) {
                        return error.message;
                      }

                      logger.warn('subscriptionData', subscriptionData);
                      return null;
                    }}
                  </Subscription>
                  {unSeen > 0 && (
                    <div className={NotificationBadgeStyle}>{unSeen > 99 ? '99+' : unSeen}</div>
                  )}
                  <Icon icon="NOTIFICATION" />
                </button>
                <button
                  className={ProfileButtonStyle}
                  data-testid="setting-button"
                  tabIndex={-1}
                  onClick={this.toggleProfile}
                  type="button"
                  ref={this.profileRef}
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
            ignoreElements={
              this.notificationRef && this.notificationRef.current
                ? [this.notificationRef.current]
                : []
            }
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
            ignoreElements={
              this.profileRef && this.profileRef.current ? [this.profileRef.current] : []
            }
          >
            <div className={DropDownWrapperStyle}>
              <div className={SubMenuWrapperStyle}>
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
