// @flow
import gql from 'graphql-tag';

export const viewerQuery = gql`
  query {
    viewer {
      user {
        ... on User {
          id
          firstName
          lastName
        }
      }
      notificationUnread
      notificationUnseen
    }
  }
`;

export default viewerQuery;
