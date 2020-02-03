// @flow
import gql from 'graphql-tag';

export const archiveNotificationMutation = gql`
  mutation notificationArchive($id: ID!) {
    notificationArchive(id: $id)
  }
`;

export const activeNotificationMutation = gql`
  mutation notificationActive($id: ID!) {
    notificationActive(id: $id)
  }
`;
