// @flow
import * as React from 'react';
import type { Notification } from 'generated/graphql';
import FormattedDate from 'components/FormattedDate';
import { BaseButton } from 'components/Buttons';
import { encodeId } from 'utils/id';
import { parseRoute, parseIcon } from 'utils/entity';
import Icon from 'components/Icon';
import NavigateLink from 'components/NavigateLink';
import {
  WrapperStyle,
  AvatarStyle,
  IconWrapperStyle,
  InfoWrapper,
  RowStyle,
  DateTimeStyle,
  ActionButtonStyle,
} from './style';
import avatar from './media/default_avatar.png';

type Props = {|
  notification: Notification,
  showActionButton?: boolean,
|};

function parseUrl(notification) {
  const id = notification?.entity?.id;

  if (!id) return '.';

  const typeName = notification?.entity?.__typename;

  return `/${parseRoute(typeName).toLowerCase()}/${encodeId(id)}`;
}

const NotificationItem = ({ notification, showActionButton = false }: Props) => {
  return (
    <div className={RowStyle}>
      <NavigateLink
        className={WrapperStyle}
        to={parseUrl(notification)}
        href={parseUrl(notification)}
      >
        <div className={AvatarStyle(notification?.sender?.avatar?.path ?? avatar)}>
          <div className={IconWrapperStyle}>
            <Icon icon={parseIcon(notification?.entity?.__typename)} />
          </div>
        </div>
        <div className={InfoWrapper}>
          {notification.body}
          <div className={DateTimeStyle}>
            <FormattedDate mode="relative" value={notification.createdAt} />
          </div>
        </div>
      </NavigateLink>
      {showActionButton && (
        <div className={ActionButtonStyle}>
          <BaseButton
            icon={notification.archived ? 'ACTIVE' : 'ARCHIVE'}
            label=""
            textColor="GRAY_DARK"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="GRAY_DARK"
            onClick={evt => {
              // TODO: trigger mutation
              evt.stopPropagation();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
