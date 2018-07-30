// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import {
  SettingsWrapperStyle,
  SettingsBodyStyle,
  SettingsCountStyle,
  DropdownWrapperStyle,
  SubMenuWrapperStyle,
  SubMenuItemStyle,
} from './style';
import messages from './messages';

type Props = {};

type State = {
  isNotificationOpen: boolean,
  isProfileOpen: boolean,
};

class Settings extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      isNotificationOpen: false,
      isProfileOpen: false,
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

  handleLogout = (client: any) => {
    client.resetStore();
  };

  wrapperRef: ?HTMLDivElement;

  render() {
    const { isNotificationOpen, isProfileOpen } = this.state;

    return (
      <div className={SettingsWrapperStyle} ref={this.setWrapperRef}>
        <div className={SettingsBodyStyle}>
          <button tabIndex={-1} onClick={this.toggleNotification} type="button">
            <div className={SettingsCountStyle}>{3}</div>
            <Icon icon="fasNotification" />
          </button>
          <button tabIndex={-1} onClick={this.toggleProfile} type="button">
            <Icon icon="fasProfile" />
          </button>
        </div>
        {isNotificationOpen && (
          <div className={DropdownWrapperStyle}>
            <div className={SubMenuWrapperStyle}>There is nothing to notice you.</div>
          </div>
        )}
        {isProfileOpen && (
          <div className={DropdownWrapperStyle}>
            <div className={SubMenuWrapperStyle}>
              <div to="/profile" className={SubMenuItemStyle}>
                <Icon icon="farUser" />
                <FormattedMessage {...messages.profile} />
              </div>
              <div to="/profile/preferences" className={SubMenuItemStyle}>
                <Icon icon="farCog" />
                <FormattedMessage {...messages.preferences} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Settings;
