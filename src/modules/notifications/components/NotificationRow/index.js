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
  NotificationRowWrapperStyle,
  NotificationRowBodyStyle,
  AvatarIconWrapperStyle,
  NotificationTypeStyle,
  NotificationMessageWrapperStyle,
  NotificationMessageStyle,
  NotificationDateStyle,
  NotificationAgoStyle,
  ArchiveButtonWrapperStyle,
  ArchiveButtonStyle,
} from './style';

type Props = {|
  notification: Notification,
|};

const NotificationRow = ({ notification }: Props) => {
  const icon = parseIcon(notification?.entity?.__typename);

  return (
    <NavigateLink
      className={NotificationRowWrapperStyle}
      to={parseUrl(notification)}
      href={parseUrl(notification)}
    >
      <div className={NotificationRowBodyStyle}>
        <div className={AvatarIconWrapperStyle}>
          <UserAvatar
            firstName={notification?.sender?.firstName}
            lastName={notification?.sender?.lastName}
            showBothInitials
            width="50px"
            height="50px"
          />

          <div className={NotificationTypeStyle(icon)}>
            <Icon icon={icon} />
          </div>
        </div>

        <div className={NotificationMessageWrapperStyle}>
          <div className={NotificationMessageStyle}>{notification.body}</div>

          <div className={NotificationDateStyle}>
            <div className={NotificationAgoStyle}>
              <FormattedDate mode="relative" value={notification.createdAt} />
            </div>
            <FormattedDate mode="datetime" value={notification.createdAt} />
          </div>
        </div>

        <div className={ArchiveButtonWrapperStyle}>
          <button
            className={ArchiveButtonStyle}
            onClick={e => {
              e.stopPropagation();
            }}
            type="button"
          >
            <Icon icon="ARCHIVE" />
          </button>
        </div>
      </div>
    </NavigateLink>
  );
};

export default NotificationRow;
