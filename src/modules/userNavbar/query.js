// @flow
import gql from 'graphql-tag';

export const countNotificationQuery = gql`
  query countNotificationQuery {
    viewer {
      notificationUnread
      notificationUnseen
    }
  }
`;

export default countNotificationQuery;
