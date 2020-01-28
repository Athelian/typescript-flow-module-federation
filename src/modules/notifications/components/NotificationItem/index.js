// @flow
import * as React from 'react';
import FormattedDate from 'components/FormattedDate';
import { encodeId } from 'utils/id';
import { parseRoute, parseIcon } from 'utils/entity';
import Icon from 'components/Icon';
import NavigateLink from 'components/NavigateLink';
import { WrapperStyle, AvatarStyle, IconWrapperStyle, InfoWrapper, DividerStyle } from './style';
import avatar from './media/default_avatar.png';

type Props = {
  notification: any,
};

function parseUrl(notification) {
  const id = notification?.entity?.id;

  if (!id) return '.';

  const typeName = notification?.entity?.__typename;

  return `/${parseRoute(typeName).toLowerCase()}/${encodeId(id)}`;
}

const NotificationItem = ({ notification }: Props) => {
  return (
    <div>
      <NavigateLink
        className={WrapperStyle}
        to={parseUrl(notification)}
        href={parseUrl(notification)}
      >
        <div className={AvatarStyle(avatar)}>
          <div className={IconWrapperStyle}>
            <Icon icon={parseIcon(notification?.entity?.__typename)} />
          </div>
        </div>
        <div className={InfoWrapper}>
          {notification.body}
          <div>
            <FormattedDate mode="relative" value={notification.createdAt} />
          </div>
        </div>
      </NavigateLink>
      <div className={DividerStyle} />
    </div>
  );
};

export default NotificationItem;
