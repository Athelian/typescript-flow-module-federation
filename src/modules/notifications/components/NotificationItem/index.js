// @flow
import * as React from 'react';
import { Mutation } from 'react-apollo';
import FormattedDate from 'components/FormattedDate';
import { Link } from '@reach/router';
import { encodeId } from 'utils/id';
import { parseRoute, parseIcon } from 'utils/entity';
import Icon from 'components/Icon';
import LoadingIcon from 'components/LoadingIcon';
import mutation from 'modules/notifications/mutation';
import { WrapperStyle, AvatarStyle, IconWrapperStyle, InfoWrapper } from './style';
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

function handleReadNotification(readNotification: Function, notificationId: number) {
  readNotification({ variables: { id: notificationId } });
}

const NotificationItem = ({ notification }: Props) => {
  React.useEffect(() => {
    const anchors = document.querySelectorAll('a[aria-current="page"]');
    const clickHandler = (evt: MouseEvent) => {
      evt.preventDefault();
    };
    if (anchors) {
      anchors.forEach(anchor => {
        anchor.addEventListener('click', clickHandler);
      });
    }
    return () => {
      if (anchors) {
        anchors.forEach(anchor => {
          anchor.removeEventListener('click', clickHandler);
        });
      }
    };
  }, []);
  return (
    <Mutation mutation={mutation}>
      {(readNotification, { loading, error }) => (
        <>
          {loading && <LoadingIcon />}
          {error && error.message}
          {/* $FlowFixMe Flow typed is not updated yet */}
          <Link
            className={WrapperStyle(notification.read)}
            to={parseUrl(notification)}
            href={parseUrl(notification)}
            onClick={() => {
              handleReadNotification(readNotification, notification.id);
            }}
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
          </Link>
        </>
      )}
    </Mutation>
  );
};

export default NotificationItem;
