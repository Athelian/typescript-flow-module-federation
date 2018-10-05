// @flow
import gql from 'graphql-tag';

export const notificationListQuery = gql`
  query($page: Int!, $perPage: Int!) {
    viewer {
      notifications(page: $page, perPage: $perPage) {
        nodes {
          id
          createdAt
          sender {
            id
            firstName
            lastName
          }
          receiver {
            id
            firstName
            lastName
          }
          body
          read
          seen
          entity {
            __typename
            ... on Model {
              id
            }
          }
        }
        page
        totalPage
      }
      notificationUnread
      notificationUnseen
    }
  }
`;

export default notificationListQuery;
