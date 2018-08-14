// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { reloadPageOnExpireToken as logout } from 'utils/auth';
import Icon from 'components/Icon';
import LogoutDialog from 'components/Dialog/LogoutDialog';
import OutsideClickHandler from 'components/OutsideClickHandler';
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

class Settings extends React.Component<Props, State> {
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
    const DUMMY_USER = 'Z';

    return (
      <div className={SettingsWrapperStyle}>
        <div className={SettingsBodyStyle}>
          <button
            tabIndex={-1}
            onClick={this.toggleNotification}
            type="button"
            ref={this.NotificationRef}
          >
            <div className={SettingsCountStyle}>{3}</div>
            <Icon icon="NOTIFICATION" />
          </button>
          <button
            className={NotificationButtonStyle}
            tabIndex={-1}
            onClick={this.toggleNotification}
            type="button"
            ref={this.ProfileRef}
          >
            <div className={NotificationBadgeStyle}>{DUMMY_BADGE > 99 ? '99+' : DUMMY_BADGE}</div>
            <Icon icon="NOTIFICATION" />
          </button>
        </div>
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
        ) : (
          <button
            className={ProfileButtonStyle}
            data-testid="setting-button"
            tabIndex={-1}
            onClick={this.toggleProfile}
            type="button"
          >
            {DUMMY_USER}
          </button>
        )}

        <LogoutDialog
          isOpen={logoutDialogOpen}
          onRequestClose={this.toggleLogoutDialog}
          onCancel={this.toggleLogoutDialog}
          onConfirm={logout}
        />
      </div>
    );
  }
}

export default Settings;
