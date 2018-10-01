import gql from 'graphql-tag';

export const orderHistoryListQuery = gql`
  query($id: ID!, $page: Int!, $perPage: Int!) {
    order(id: $id) {
      id
      timeline {
        id
        events(page: $page, perPage: $perPage) {
          nodes {
            __typename
            ... on EventComment {
              id
              content
              createdAt
              updatedAt
              createdBy {
                firstName
                lastName
              }
              updatedAt
              updatedBy {
                firstName
                lastName
              }
              deletedAt
              deletedBy {
                firstName
                lastName
              }
              ownedBy {
                id
                zipCode
              }
            }
            ... on EventChange {
              id
              ownedBy {
                id
              }
              createdAt
              updatedAt
              createdBy {
                firstName
                lastName
              }
              updatedAt
              updatedBy {
                firstName
                lastName
              }
              adds {
                entity {
                  __typename
                }
              }
              removes {
                entity {
                  __typename
                }
              }
              updates {
                entity {
                  __typename
                }
                field
                oldValue
                newValue
              }
            }
          }
          page
          perPage
          totalPage
        }
      }
    }
  }
`;

export default orderHistoryListQuery;
