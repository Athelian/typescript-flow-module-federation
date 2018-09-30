// @flow
import * as React from 'react';
import { Mutation } from 'react-apollo';
import { FormattedRelative } from 'react-intl';
import { Link } from '@reach/router';
import Icon from 'components/Icon';
import LoadingIcon from 'components/LoadingIcon';
import mutation from 'modules/notifications/mutation';
import { WrapperStyle, AvatarStyle, IconWrapperStyle, InfoWrapper } from './style';
import avatar from './media/default_avatar.png';

type Props = {
  notification: any,
};

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
          to="/notifications"
          className={WrapperStyle(notification.read)}
          onClick={() => handleReadNotification(readNotification, notification.id)}
        >
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
        </Link>
      </>
    )}
  </Mutation>
);

export default NotificationItem;
