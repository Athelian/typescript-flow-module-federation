// @flow
import gql from 'graphql-tag';

export const notificationListQuery = gql`
  query notificationListQuery($page: Int!, $perPage: Int!, $filterBy: NotificationFilterInput) {
    viewer {
      notifications(page: $page, perPage: $perPage, filterBy: $filterBy) {
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
              ... on Milestone {
                id
                __typename
                project {
                  ... on Project {
                    id
                  }
                }
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

export const notificationPreferencesQuery = gql`
  query notificationPreferencesQuery {
    viewer {
      notificationPreferences {
        ... on NotificationPreferences {
          allowedEmail
          emailInterval {
            hours
            minutes
          }
          notifications {
            ... on NotificationPreference {
              type
              enabled
            }
          }
        }
      }
    }
  }
`;
