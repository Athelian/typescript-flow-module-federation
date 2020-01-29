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
                avatar {
                  ... on File {
                    path(preset: Small)
                  }
                }
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
            seen
            archived
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
      notificationCount
      notificationUnseenCount
    }
  }
`;

export default notificationListQuery;
