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
            ... on Product {
              id
            }
            ... on Shipment {
              id
            }
            ... on Order {
              id
            }
            ... on Batch {
              id
            }
            ... on Tag {
              id
            }
          }
        }
        page
        totalPage
      }
    }
  }
`;

export default notificationListQuery;
