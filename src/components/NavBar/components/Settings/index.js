// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { logout } from 'utils/auth';
import Icon from 'components/Icon';
import LogoutDialog from 'components/Dialog/LogoutDialog';
import OutsideClickHandler from 'components/OutsideClickHandler';
import {
  SettingsWrapperStyle,
  SettingsBodyStyle,
  SettingsCountStyle,
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
  state = {
    isNotificationOpen: false,
    isProfileOpen: false,
    logoutDialogOpen: false,
  };

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

  render() {
    const { isNotificationOpen, isProfileOpen, logoutDialogOpen } = this.state;

    return (
      <div className={SettingsWrapperStyle}>
        <div className={SettingsBodyStyle}>
          <button tabIndex={-1} onClick={this.toggleNotification} type="button">
            <div className={SettingsCountStyle}>{3}</div>
            <Icon icon="fasNotification" />
          </button>
          <button
            data-testid="setting-button"
            tabIndex={-1}
            onClick={this.toggleProfile}
            type="button"
          >
            Z
          </button>
        </div>
        {isNotificationOpen && (
          <OutsideClickHandler onOutsideClick={this.handleClickOutside}>
            <div className={NotificationDropDownWrapperStyle}>
              <div className={SubMenuWrapperStyle}>There is nothing to notice you.</div>
            </div>
          </OutsideClickHandler>
        )}
        {isProfileOpen && (
          <OutsideClickHandler onOutsideClick={this.handleClickOutside}>
            <div className={DropDownWrapperStyle}>
              <div className={SubMenuWrapperStyle}>
                <div className={SubMenuItemStyle}>
                  <div>
                    <Icon icon="fasProfile" />
                  </div>
                  <div>
                    <FormattedMessage {...messages.profile} />
                  </div>
                </div>
                <div className={SubMenuItemStyle}>
                  <div>
                    <Icon icon="fasCog" />
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
                    <Icon icon="fasLogout" />
                  </div>
                  <div>
                    <FormattedMessage {...messages.logout} />
                  </div>
                </div>
              </div>
            </div>
          </OutsideClickHandler>
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
