// @flow
import * as React from 'react';
import type { Notification } from 'generated/graphql';
import { navigate } from '@reach/router';
import { useMutation } from '@apollo/react-hooks';
import FormattedDate from 'components/FormattedDate';
import { parseIcon } from 'utils/entity';
import { parseUrl } from 'utils/notifications';
import Icon from 'components/Icon';
import UserAvatar from 'components/UserAvatar';
import { archiveNotificationMutation, activeNotificationMutation } from './mutation';
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
  onRemove: (id: string) => void,
|};

const NotificationRow = ({ notification, onRemove }: Props) => {
  const icon = parseIcon(notification?.entity?.__typename);
  const [activeNotification] = useMutation(activeNotificationMutation, {
    onCompleted: () => {
      onRemove(notification.id);
    },
  });
  const [archiveNotification] = useMutation(archiveNotificationMutation, {
    onCompleted: () => {
      onRemove(notification.id);
    },
  });

  return (
    <div
      className={NotificationRowWrapperStyle}
      role="presentation"
      onClick={() => {
        navigate(parseUrl(notification));
      }}
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
              if (notification.archived) {
                activeNotification({ variables: { id: notification.id } });
              } else {
                archiveNotification({ variables: { id: notification.id } });
              }
            }}
            type="button"
          >
            <Icon icon={notification.archived ? 'ACTIVE' : 'ARCHIVE'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationRow;
