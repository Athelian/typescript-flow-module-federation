// @flow
import gql from 'graphql-tag';

export const countNotificationQuery = gql`
  query countNotificationQuery {
    viewer {
      notificationUnseenCount
    }
  }
`;

export default countNotificationQuery;
