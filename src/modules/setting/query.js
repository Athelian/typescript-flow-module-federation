// @flow
import gql from 'graphql-tag';

export const viewerQuery = gql`
  query {
    viewer {
      user {
        id
        firstName
        lastName
      }
      notificationUnread
    }
  }
`;

export default viewerQuery;
