import gql from 'graphql-tag';

export const orderLogsListQuery = gql`
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
                id
                firstName
                lastName
              }
              updatedAt
              updatedBy {
                id
                firstName
                lastName
              }
              deletedAt
              deletedBy {
                id
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
                id
                firstName
                lastName
              }
              updatedAt
              updatedBy {
                id
                firstName
                lastName
              }
              adds {
                entity {
                  __typename
                  ... on OrderItem {
                    productProvider {
                      id
                      product {
                        id
                        name
                      }
                    }
                  }
                  ... on Batch {
                    id
                    no
                  }
                  ... on Model {
                    id
                  }
                }
              }
              removes {
                entity {
                  __typename
                  ... on OrderItem {
                    productProvider {
                      id
                      product {
                        id
                        name
                      }
                    }
                  }
                  ... on Batch {
                    id
                    no
                  }
                  ... on Model {
                    id
                  }
                }
              }
              updates {
                entity {
                  __typename
                  ... on OrderItem {
                    productProvider {
                      id
                      product {
                        id
                        name
                      }
                    }
                  }
                  ... on Batch {
                    id
                    no
                  }
                  ... on Model {
                    id
                  }
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

export default orderLogsListQuery;
