// @flow
import * as React from 'react';
import { Query, Subscription } from 'react-apollo';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import { NotificationsDropdown, UserMenuDropdown } from './components';
import { notificationSeeAllMutation } from './mutation';
import query from './query';
import subscription from './subscription';
import {
  SettingsWrapperStyle,
  NotificationsWrapperStyle,
  NotificationsButtonStyle,
  NotificationBadgeStyle,
  UserMenuWrapperStyle,
  UserMenuButtonStyle,
} from './style';

type Props = {};

type State = {
  isNotificationOpen: boolean,
  isUserMenuOpen: boolean,
};

class Setting extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      isNotificationOpen: false,
      isUserMenuOpen: false,
    };

    this.notificationRef = React.createRef();
    this.userMenuRef = React.createRef();
  }

  handleClickOutside = () => {
    const { isNotificationOpen, isUserMenuOpen } = this.state;

    if (isNotificationOpen) {
      this.toggleNotification();
    } else if (isUserMenuOpen) {
      this.toggleUserMenu();
    }
  };

  toggleNotification = () => {
    this.setState(prevState => ({
      isNotificationOpen: !prevState.isNotificationOpen,
      isUserMenuOpen: false,
    }));
  };

  toggleUserMenu = () => {
    this.setState(prevState => ({
      isUserMenuOpen: !prevState.isUserMenuOpen,
      isNotificationOpen: false,
    }));
  };

  notificationRef: any;

  userMenuRef: any;

  render() {
    const { isNotificationOpen, isUserMenuOpen } = this.state;

    return (
      <div className={SettingsWrapperStyle}>
        <Query query={query}>
          {({ data, client, refetch }) => {
            const viewer = {
              firstName: getByPathWithDefault('TODO', 'viewer.user.firstName', data),
              lastName: getByPathWithDefault('TODO', 'viewer.user.lastName', data),
            };
            const unSeen = getByPathWithDefault(0, 'viewer.notificationUnseen', data);

            return (
              <>
                <div className={NotificationsWrapperStyle}>
                  <button
                    className={NotificationsButtonStyle}
                    onClick={async () => {
                      this.toggleNotification();
                      if (unSeen > 0) {
                        await client.mutate({
                          mutation: notificationSeeAllMutation,
                        });
                        refetch();
                      }
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

                  <OutsideClickHandler
                    onOutsideClick={this.handleClickOutside}
                    ignoreClick={!isNotificationOpen}
                    ignoreElements={
                      this.notificationRef && this.notificationRef.current
                        ? [this.notificationRef.current]
                        : []
                    }
                  >
                    <NotificationsDropdown
                      isOpen={isNotificationOpen}
                      toggleNotification={this.toggleNotification}
                    />
                  </OutsideClickHandler>
                </div>

                <div className={UserMenuWrapperStyle}>
                  <button
                    className={UserMenuButtonStyle}
                    onClick={this.toggleUserMenu}
                    type="button"
                    ref={this.userMenuRef}
                  >
                    <UserAvatar firstName={viewer.firstName} lastName={viewer.lastName} />
                  </button>

                  <OutsideClickHandler
                    onOutsideClick={this.handleClickOutside}
                    ignoreClick={!isUserMenuOpen}
                    ignoreElements={
                      this.userMenuRef && this.userMenuRef.current ? [this.userMenuRef.current] : []
                    }
                  >
                    <UserMenuDropdown
                      isOpen={isUserMenuOpen}
                      toggleUserMenu={this.toggleUserMenu}
                    />
                  </OutsideClickHandler>
                </div>
              </>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Setting;
