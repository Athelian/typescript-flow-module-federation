// @flow
import * as React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FormattedMessage } from 'react-intl';
import { Tooltip } from 'components/Tooltip';
import Icon from 'components/Icon';
import LoadingIcon from 'components/LoadingIcon';
import NavigateLink from 'components/NavigateLink';
import { BaseButton } from 'components/Buttons';
import { Label } from 'components/Form';
import NotificationItem from 'modules/notifications/components/NotificationItem';
import { notificationListQuery } from 'modules/notifications/query';
import { isNotFound, isForbidden, isBadRequest } from 'utils/data';
import {
  NotificationsDropDownWrapperStyle,
  NotificationsBodyWrapperStyle,
  NotificationsHeaderStyle,
  NotificationsIconStyle,
  NotificationsFooterStyle,
  NoNotificationStyle,
  ArchiveAllButtonStyle,
} from './style';

const defaultRenderItem = (item: Object) => <NotificationItem key={item.id} notification={item} />;

type Props = {|
  isOpen: boolean,
  renderItem?: Object => React$Node,
  // TODO: integrate the api for more items
  totalMoreItems?: number,
|};

const NotificationsDropdown = ({
  renderItem = defaultRenderItem,
  isOpen,
  totalMoreItems = 0,
}: Props) => {
  const { data, loading, error } = useQuery(notificationListQuery, {
    variables: { page: 1, perPage: 10 },
    fetchPolicy: 'no-cache',
  });

  if (error) {
    return error.message;
  }

  const items = (data?.viewer?.notifications?.nodes ?? [])
    .filter(
      notification =>
        !isNotFound(notification) && !isForbidden(notification) && !isBadRequest(notification)
    )
    .splice(0, 10);

  return (
    <div className={NotificationsDropDownWrapperStyle(isOpen)}>
      <div className={NotificationsBodyWrapperStyle}>
        {!loading && items.length === 0 && (
          <div className={NoNotificationStyle}>
            <FormattedMessage
              id="components.Header.notification.noActiveNotifications"
              defaultMessage="No active notifications found"
            />
          </div>
        )}

        {loading ? <LoadingIcon /> : items.map(renderItem)}

        <div className={NotificationsFooterStyle}>
          {totalMoreItems === 0 && (
            <Label align="center">
              <FormattedMessage
                id="components.Header.notification.viewMoreNotifications"
                defaultMessage="{totalMoreItems} more..."
                values={{
                  totalMoreItems,
                }}
              />
            </Label>
          )}

          <NavigateLink to="/notifications">
            <BaseButton
              label={
                <FormattedMessage
                  id="components.Header.notification.viewAllNotification"
                  defaultMessage="VIEW ALL NOTIFICATIONS"
                />
              }
              icon="NOTIFICATION"
              textColor="TEAL"
              hoverTextColor="TEAL"
              backgroundColor="GRAY_SUPER_LIGHT"
              hoverBackgroundColor="GRAY_VERY_LIGHT"
            />
          </NavigateLink>
        </div>
      </div>

      <div className={NotificationsHeaderStyle}>
        <div className={NotificationsIconStyle}>
          <Icon icon="ACTIVE" />
        </div>
        <Label>
          <FormattedMessage
            id="components.Header.notification.title"
            defaultMessage="NOTIFICATIONS"
          />
        </Label>

        <NavigateLink to="/notifications">
          <BaseButton
            label={
              <FormattedMessage
                id="components.Header.notification.viewAll"
                defaultMessage="VIEW ALL"
              />
            }
            icon="NOTIFICATION"
            textColor="TEAL"
            hoverTextColor="TEAL_DARK"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="GRAY_VERY_LIGHT"
          />
        </NavigateLink>

        <Tooltip
          message={
            <FormattedMessage
              id="components.Header.notification.archiveAllNotifications"
              defaultMessage="Archive all notifications"
            />
          }
        >
          <button className={ArchiveAllButtonStyle} onClick={() => {}} type="button">
            <Icon icon="ARCHIVE" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default NotificationsDropdown;
