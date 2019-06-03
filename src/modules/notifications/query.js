// @flow
import gql from 'graphql-tag';

export const notificationListQuery = gql`
  query notificationListQuery($page: Int!, $perPage: Int!) {
    viewer {
      notifications(page: $page, perPage: $perPage) {
        nodes {
          ... on Notification {
            id
            createdAt
            sender {
              ... on User {
                id
                firstName
                lastName
              }
            }
            receiver {
              ... on User {
                id
                firstName
                lastName
              }
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
