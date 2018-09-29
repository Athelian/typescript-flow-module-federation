// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import { Link } from '@reach/router';
import { FormattedMessage } from 'react-intl';
import { getByPathWithDefault } from 'utils/fp';

import LoadingIcon from 'components/LoadingIcon';
import NotificationItem from 'modules/notifications/components/NotificationItem';
import query from 'modules/notifications/query';
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

const NotificationDropDown = ({ renderItem, toggleNotification }: Props) => (
  <Query
    query={query}
    variables={{
      page: 1,
      perPage: 1,
    }}
    fetchPolicy="network-only"
  >
    {({
      loading,
      // data,
      error,
    }) => {
      if (error) {
        return error.message;
      }
      const data = {
        viewer: {
          notifications: {
            nodes: [
              {
                id: 1,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 2,
                body: '123',
                read: false,
                createdAt: new Date().toString(),
              },
              {
                id: 3,
                body: '123',
                read: false,
                createdAt: new Date().toString(),
              },
              {
                id: 4,
                body: '123',
                read: false,
                createdAt: new Date().toString(),
              },
              {
                id: 5,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 6,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 7,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 8,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 9,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 10,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 11,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 12,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
              {
                id: 13,
                body: '123',
                read: true,
                createdAt: new Date().toString(),
              },
            ],
            page: 1,
            totalPage: 2,
          },
        },
      };
      const items = getByPathWithDefault([], 'viewer.notifications.nodes', data);
      return (
        <div className={WrapperStyle}>
          <div className={HeaderStyle}>
            <div className={TitleStyle}>
              <FormattedMessage {...messages.title} />
            </div>
            <button
              type="button"
              className={ClearAllStyle}
              onClick={() => console.log('clear all')}
            >
              <FormattedMessage {...messages.readAll} />
            </button>
          </div>
          <div className={ListWrapperStyle}>
            {renderNotificationList(loading, items, renderItem)}
          </div>
          <Link to="/notifications" onClick={toggleNotification} className={ViewAllStyle}>
            <FormattedMessage {...messages.viewAll} />
          </Link>
        </div>
      );
    }}
  </Query>
);

NotificationDropDown.defaultProps = defaultProps;

export default NotificationDropDown;
