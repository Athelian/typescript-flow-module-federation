// @flow
import gql from 'graphql-tag';

export const countNotificationQuery = gql`
  query countNotificationQuery {
    viewer {
      notificationCount
      notificationUnseenCount
    }
  }
`;

export default countNotificationQuery;
