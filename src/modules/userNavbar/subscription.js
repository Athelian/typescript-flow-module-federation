// @flow
import gql from 'graphql-tag';

export const subscribeNewNotification = gql`
  subscription notificationNew {
    notificationNew {
      id
      type
      body
      read
      seen
      createdAt
    }
  }
`;

export default subscribeNewNotification;
