// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import LogoutDialog from 'components/Dialog/LogoutDialog';
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
  constructor() {
    super();

    this.state = {
      isNotificationOpen: false,
      isProfileOpen: false,
      logoutDialogOpen: false,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef = (node: ?HTMLDivElement) => {
    this.wrapperRef = node;
  };

  handleClickOutside = (event: MouseEvent) => {
    if (
      this.wrapperRef &&
      event.target instanceof Node &&
      !this.wrapperRef.contains(event.target)
    ) {
      const { isNotificationOpen, isProfileOpen } = this.state;
      if (isNotificationOpen) {
        this.toggleNotification();
      } else if (isProfileOpen) {
        this.toggleProfile();
      }
    }
  };

  toggleNotification = () => {
    const { isNotificationOpen } = this.state;
    this.setState({ isNotificationOpen: !isNotificationOpen, isProfileOpen: false });
  };

  toggleProfile = () => {
    const { isProfileOpen } = this.state;
    this.setState({ isProfileOpen: !isProfileOpen, isNotificationOpen: false });
  };

  toggleLogoutDialog = () => {
    this.setState(previous => ({ logoutDialogOpen: !previous.logoutDialogOpen }));
  };

  wrapperRef: ?HTMLDivElement;

  render() {
    const { isNotificationOpen, isProfileOpen, logoutDialogOpen } = this.state;

    return (
      <div className={SettingsWrapperStyle} ref={this.setWrapperRef}>
        <div className={SettingsBodyStyle}>
          <button tabIndex={-1} onClick={this.toggleNotification} type="button">
            <div className={SettingsCountStyle}>{3}</div>
            <Icon icon="fasNotification" />
          </button>
          <button tabIndex={-1} onClick={this.toggleProfile} type="button">
            Z
          </button>
        </div>
        {isNotificationOpen && (
          <div className={NotificationDropDownWrapperStyle}>
            <div className={SubMenuWrapperStyle}>There is nothing to notice you.</div>
          </div>
        )}
        {isProfileOpen && (
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
        )}
        <LogoutDialog isOpen={logoutDialogOpen} onRequestClose={this.toggleLogoutDialog} />
      </div>
    );
  }
}

export default Settings;
