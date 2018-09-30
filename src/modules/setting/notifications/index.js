// @flow
import * as React from 'react';
import { Query, Mutation } from 'react-apollo';
import { Link } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { getByPathWithDefault } from 'utils/fp';

import LoadingIcon from 'components/LoadingIcon';
import NotificationItem from 'modules/notifications/components/NotificationItem';
import query from 'modules/notifications/query';
import { notificationReadAllMutation, notificationSeeAllMutation } from './mutation';
import {
  WrapperStyle,
  HeaderStyle,
  TitleStyle,
  ClearAllStyle,
  NoNotificationStyle,
  ListWrapperStyle,
  ViewAllStyle,
} from './style';

import messages from './messages';

const defaultRenderItem = (item: Object) => <NotificationItem key={item.id} notification={item} />;

const renderNotificationList = (loading: boolean, items: Array<Object>, renderItem?: Function) => {
  if (loading) {
    return <LoadingIcon />;
  }

  if (items.length === 0) {
    return (
      <div className={NoNotificationStyle}>
        <FormattedMessage {...messages.noNotifications} />
      </div>
    );
  }
  return (
    <div>
      {items.map((item: Object) => (renderItem ? renderItem(item) : defaultRenderItem(item)))}
    </div>
  );
};

type Props = {
  renderItem?: Function,
  toggleNotification: Function,
};

const defaultProps = {
  renderItem: defaultRenderItem,
};

class NotificationDropDown extends React.Component<Props> {
  static defaultProps = defaultProps;

  handleSeeAll = (seeAllNotification: Function) => {
    const { toggleNotification } = this.props;
    seeAllNotification();
    toggleNotification();
  };

  render() {
    const { renderItem } = this.props;

    return (
      <Query
        query={query}
        variables={{
          page: 1,
          perPage: 10,
        }}
        fetchPolicy="network-only"
      >
        {({ loading, data, error }) => {
          if (error) {
            return error.message;
          }

          if (loading) return <LoadingIcon />;

          const items = getByPathWithDefault([], 'viewer.notifications.nodes', data);
          return (
            <div className={WrapperStyle}>
              <Mutation mutation={notificationReadAllMutation}>
                {(readAllNotification, { loading: isLoading, error: apiError }) => (
                  <>
                    <div className={HeaderStyle}>
                      <div className={TitleStyle}>
                        <FormattedMessage {...messages.title} />
                      </div>
                      {items.length > 0 && (
                        <button
                          type="button"
                          className={ClearAllStyle}
                          onClick={() => readAllNotification()}
                        >
                          <FormattedMessage {...messages.readAll} />
                        </button>
                      )}
                    </div>
                    {isLoading && <LoadingIcon />}
                    {apiError && apiError.message}
                    <div className={ListWrapperStyle}>
                      {renderNotificationList(loading, items, renderItem)}
                    </div>
                  </>
                )}
              </Mutation>
              <Mutation mutation={notificationSeeAllMutation}>
                {(seeAllNotification, { loading: isLoading, error: apiError }) => (
                  <>
                    {isLoading && <LoadingIcon />}
                    {apiError && apiError.message}
                    <Link
                      to="/notifications"
                      onClick={() => this.handleSeeAll(seeAllNotification)}
                      className={ViewAllStyle}
                    >
                      <FormattedMessage {...messages.viewAll} />
                    </Link>
                  </>
                )}
              </Mutation>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default NotificationDropDown;
