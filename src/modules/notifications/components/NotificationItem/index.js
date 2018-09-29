// @flow
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import Icon from 'components/Icon';
import { WrapperStyle, AvatarStyle, IconWrapperStyle, InfoWrapper } from './style';
import avatar from './media/default_avatar.png';

type Props = {
  notification: any,
};

const NotificationItem = ({ notification }: Props) => (
  <div className={WrapperStyle(notification.read)}>
    <div className={AvatarStyle(avatar)}>
      <div className={IconWrapperStyle}>
        <Icon icon="STAFF" />
      </div>
    </div>
    <div className={InfoWrapper}>
      {notification.body}
      <div className="data">
        <FormattedRelative value={new Date(notification.createdAt)} />
      </div>
    </div>
  </div>
);

export default NotificationItem;
