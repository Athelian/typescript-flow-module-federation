// @flow
import * as React from 'react';
import { Query, Subscription } from 'react-apollo';
import { UserConsumer } from 'contexts/Viewer';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import { NotificationsDropdown, UserMenuDropdown } from './components';
import { notificationSeeAllMutation } from './mutation';
import { countNotificationQuery } from './query';
import { subscribeNewNotification } from './subscription';
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
  unSeen: number,
};

class UserNavBar extends React.Component<Props, State> {
  state = {
    isNotificationOpen: false,
    isUserMenuOpen: false,
    unSeen: 0,
  };

  notificationRef: { current: HTMLButtonElement | null } = React.createRef();

  userMenuRef: { current: HTMLButtonElement | null } = React.createRef();

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

  render() {
    const { isNotificationOpen, isUserMenuOpen, unSeen } = this.state;

    return (
      <Query
        query={countNotificationQuery}
        fetchPolicy="network-only"
        onCompleted={result => {
          if (unSeen !== getByPathWithDefault(0, 'viewer.notificationUnseen', result)) {
            this.setState({
              unSeen: getByPathWithDefault(0, 'viewer.notificationUnseen', result),
            });
          }
        }}
      >
        {({ client, refetch }) => {
          return (
            <div className={SettingsWrapperStyle}>
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
                  <Subscription
                    subscription={subscribeNewNotification}
                    onSubscriptionData={onSubscriptionData => {
                      logger.warn('onSubscriptionData', onSubscriptionData);
                      this.setState(prevState => ({
                        unSeen: prevState.unSeen + 1,
                      }));
                    }}
                  >
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
                  {isNotificationOpen && (
                    <NotificationsDropdown
                      isOpen={isNotificationOpen}
                      closeDropdown={() => this.setState({ isNotificationOpen: false })}
                      toggleNotification={this.toggleNotification}
                    />
                  )}
                </OutsideClickHandler>
              </div>

              <div className={UserMenuWrapperStyle}>
                <button
                  className={UserMenuButtonStyle}
                  onClick={this.toggleUserMenu}
                  type="button"
                  data-testid="setting-button"
                  ref={this.userMenuRef}
                >
                  <UserConsumer>
                    {({ user }) => (
                      <UserAvatar firstName={user.firstName} lastName={user.lastName} hideTooltip />
                    )}
                  </UserConsumer>
                </button>

                <OutsideClickHandler
                  onOutsideClick={this.handleClickOutside}
                  ignoreClick={!isUserMenuOpen}
                  ignoreElements={
                    this.userMenuRef && this.userMenuRef.current ? [this.userMenuRef.current] : []
                  }
                >
                  <UserMenuDropdown isOpen={isUserMenuOpen} toggleUserMenu={this.toggleUserMenu} />
                </OutsideClickHandler>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default UserNavBar;
