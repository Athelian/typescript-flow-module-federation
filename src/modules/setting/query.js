// @flow
import gql from 'graphql-tag';

export const countNotificationQuery = gql`
  query {
    viewer {
      notificationUnread
      notificationUnseen
    }
  }
`;

export default countNotificationQuery;
