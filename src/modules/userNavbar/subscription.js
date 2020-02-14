// @flow
import gql from 'graphql-tag';

export const subscribeNewNotification = gql`
  subscription notificationNew {
    notificationNew {
      id
      type
      body
      seen
      createdAt
    }
  }
`;

export default subscribeNewNotification;
