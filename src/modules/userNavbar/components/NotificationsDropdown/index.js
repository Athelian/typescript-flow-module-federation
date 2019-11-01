// @flow
import * as React from 'react';
import { Query, Mutation } from 'react-apollo';
import { Link } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { getByPathWithDefault } from 'utils/fp';
import LoadingIcon from 'components/LoadingIcon';
import { BaseButton } from 'components/Buttons';
import { Label } from 'components/Form';
import NotificationItem from 'modules/notifications/components/NotificationItem';
import query from 'modules/notifications/query';
import { notificationReadAllMutation } from './mutation';
import {
  NotificationsDropDownWrapperStyle,
  NotificationsBodyWrapperStyle,
  NotificationsListWrapperStyle,
  NotificationsHeaderStyle,
  NotificationsFooterStyle,
  NoNotificationStyle,
} from './style';

const defaultRenderItem = (item: Object) => <NotificationItem key={item.id} notification={item} />;

type OptionalProps = {
  renderItem: Function,
};

type Props = OptionalProps & {
  isOpen: boolean,
  toggleNotification: Function,
};

const defaultProps = {
  renderItem: defaultRenderItem,
};

class NotificationsDropdown extends React.Component<Props> {
  static defaultProps = defaultProps;

  handleSeeAll = (seeAllNotification: Function) => {
    const { toggleNotification } = this.props;
    seeAllNotification();
    toggleNotification();
  };

  render() {
    const { renderItem, isOpen } = this.props;

    return (
      <Query
        query={query}
        variables={{
          page: 1,
          perPage: 10,
        }}
        fetchPolicy="network-only"
      >
        {({ loading, data, error, refetch }) => {
          if (error) {
            return error.message;
          }

          const items = getByPathWithDefault([], 'viewer.notifications.nodes', data);
          const unRead = getByPathWithDefault(0, 'viewer.notificationUnread', data);

          return (
            <div className={NotificationsDropDownWrapperStyle(isOpen)}>
              <div className={NotificationsBodyWrapperStyle}>
                <div className={NotificationsListWrapperStyle}>
                  {!loading && items.length === 0 && (
                    <div className={NoNotificationStyle}>
                      <FormattedMessage
                        id="components.Header.notification.noNotifications"
                        defaultMessage="No notifications"
                      />
                    </div>
                  )}
                  {items.map((item: Object) =>
                    renderItem ? renderItem(item) : defaultRenderItem(item)
                  )}
                  {loading && <LoadingIcon />}
                </div>
                <div className={NotificationsHeaderStyle}>
                  <Label>
                    <FormattedMessage
                      id="components.Header.notification.title"
                      defaultMessage="NOTIFICATIONS"
                    />
                  </Label>
                  {unRead > 0 && (
                    <Mutation mutation={notificationReadAllMutation}>
                      {(readAllNotification, { loading: isLoading, error: apiError }) => (
                        <>
                          {apiError && apiError.message}
                          <BaseButton
                            onClick={async () => {
                              await readAllNotification();
                              refetch({
                                page: 1,
                                perPage: 10,
                              });
                            }}
                            isLoading={isLoading}
                            label={
                              <FormattedMessage
                                id="components.Header.notification.readAll"
                                defaultMessage="MARK ALL AS READ"
                              />
                            }
                            textColor="BLUE"
                            hoverTextColor="WHITE"
                            backgroundColor="WHITE"
                            hoverBackgroundColor="BLUE"
                          />
                        </>
                      )}
                    </Mutation>
                  )}
                </div>
                <div className={NotificationsFooterStyle}>
                  {/* $FlowFixMe Flow typed is not updated yet */}
                  <Link to="/notifications">
                    <BaseButton
                      label={
                        <FormattedMessage
                          id="components.Header.notification.viewAll"
                          defaultMessage="VIEW ALL"
                        />
                      }
                      textColor="TEAL"
                      hoverTextColor="WHITE"
                      backgroundColor="WHITE"
                      hoverBackgroundColor="TEAL"
                    />
                  </Link>
                </div>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default NotificationsDropdown;
