// @flow
import * as React from 'react';
import { Mutation } from 'react-apollo';
import FormattedDate from 'components/FormattedDate';
import { Link } from '@reach/router';
import { getByPathWithDefault } from 'utils/fp';
import { encodeId } from 'utils/id';
import Icon from 'components/Icon';
import LoadingIcon from 'components/LoadingIcon';
import mutation from 'modules/notifications/mutation';
import { WrapperStyle, AvatarStyle, IconWrapperStyle, InfoWrapper } from './style';
import avatar from './media/default_avatar.png';

type Props = {
  notification: any,
};

function parseUrl(notification) {
  if (getByPathWithDefault('', 'entity.id', notification) === '') return '.';

  if (notification?.entity?.__typename === 'OrderItem') {
    return `/order-item/${encodeId(notification?.entity?.id ?? '')}`;
  }

  return `/${getByPathWithDefault(
    'STAFF',
    'entity.__typename',
    notification
  ).toLowerCase()}/${encodeId(getByPathWithDefault('', 'entity.id', notification))}`;
}

function parseIcon(notification) {
  if (notification?.entity?.__typename === 'OrderItem') {
    return 'ORDER_ITEM';
  }

  return (notification?.entity?.__typename ?? '').toUpperCase();
}

function handleReadNotification(readNotification: Function, notificationId: number) {
  readNotification({ variables: { id: notificationId } });
}

const NotificationItem = ({ notification }: Props) => (
  <Mutation mutation={mutation}>
    {(readNotification, { loading, error }) => (
      <>
        {loading && <LoadingIcon />}
        {error && error.message}
        <Link
          to={parseUrl(notification)}
          className={WrapperStyle(notification.read)}
          onClick={() => handleReadNotification(readNotification, notification.id)}
        >
          <div className={AvatarStyle(avatar)}>
            <div className={IconWrapperStyle}>
              <Icon icon={parseIcon(notification)} />
            </div>
          </div>
          <div className={InfoWrapper}>
            {notification.body}
            <div className="data">
              <FormattedDate mode="relative" value={notification.createdAt} />
            </div>
          </div>
        </Link>
      </>
    )}
  </Mutation>
);

export default NotificationItem;
