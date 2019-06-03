// @flow
import * as React from 'react';
import { Query, Subscription } from 'react-apollo';
import { UserConsumer } from 'modules/user';
import UserAvatar from 'components/UserAvatar';
import Icon from 'components/Icon';
import OutsideClickHandler from 'components/OutsideClickHandler';
import { getByPathWithDefault } from 'utils/fp';
import logger from 'utils/logger';
import { NotificationsDropdown, UserMenuDropdown } from './components';
import { notificationSeeAllMutation } from './mutation';
import { countNotificationQuery } from './query';
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

class UserNavBar extends React.Component<Props, State> {
  state = {
    isNotificationOpen: false,
    isUserMenuOpen: false,
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
    const { isNotificationOpen, isUserMenuOpen } = this.state;

    return (
      <div className={SettingsWrapperStyle}>
        <Query query={countNotificationQuery} fetchPolicy="network-only">
          {({ data, client, refetch }) => {
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
                    {isNotificationOpen && (
                      <NotificationsDropdown
                        isOpen={isNotificationOpen}
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
                        <UserAvatar
                          firstName={user.firstName}
                          lastName={user.lastName}
                          hideTooltip
                        />
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

export default UserNavBar;
