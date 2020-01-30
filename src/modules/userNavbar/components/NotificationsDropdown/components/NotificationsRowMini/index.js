// @flow
import * as React from 'react';
import type { Notification } from 'generated/graphql';
import FormattedDate from 'components/FormattedDate';
import { parseIcon } from 'utils/entity';
import { parseUrl } from 'utils/notifications';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import NavigateLink from 'components/NavigateLink';
import {
  NotificationRowMiniWrapperStyle,
  NotificationRowMiniBodyStyle,
  AvatarIconWrapperStyle,
  NotificationTypeStyle,
  NotificationMessageWrapperStyle,
  NotificationMessageStyle,
  NotificationDateStyle,
} from './style';

type Props = {|
  notification: Notification,
  closeDropdown: () => void,
|};

const NotificationRowMini = ({ notification, closeDropdown }: Props) => {
  const icon = parseIcon(notification?.entity?.__typename);

  return (
    <NavigateLink
      className={NotificationRowMiniWrapperStyle}
      to={parseUrl(notification)}
      href={parseUrl(notification)}
      onClick={closeDropdown}
    >
      <div className={NotificationRowMiniBodyStyle}>
        <div className={AvatarIconWrapperStyle}>
          <UserAvatar
            firstName={notification?.sender?.firstName}
            lastName={notification?.sender?.lastName}
            showBothInitials
          />

          <div className={NotificationTypeStyle(icon)}>
            <Icon icon={icon} />
          </div>
        </div>

        <div className={NotificationMessageWrapperStyle}>
          <div className={NotificationMessageStyle}>{notification.body}</div>

          <div className={NotificationDateStyle}>
            <FormattedDate mode="relative" value={notification.createdAt} />
          </div>
        </div>
      </div>
    </NavigateLink>
  );
};

export default NotificationRowMini;
