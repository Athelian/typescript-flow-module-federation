import gql from 'graphql-tag';

export const shipmentLogsListQuery = gql`
  query($id: ID!) {
    shipment(id: $id) {
      ... on Shipment {
        id
        #        timeline {
        #          id
        #          events(page: $page, perPage: $perPage) {
        #            nodes {
        #              __typename
        #              ... on EventComment {
        #                id
        #                content
        #                createdAt
        #                updatedAt
        #                createdBy {
        #                  ... on User {
        #                    id
        #                    firstName
        #                    lastName
        #                  }
        #                }
        #                updatedAt
        #                updatedBy {
        #                  ... on User {
        #                    id
        #                    firstName
        #                    lastName
        #                  }
        #                }
        #                deletedAt
        #                deletedBy {
        #                  ... on User {
        #                    id
        #                    firstName
        #                    lastName
        #                  }
        #                }
        #                ownedBy {
        #                  ... on Group {
        #                    id
        #                    zipCode
        #                  }
        #                }
        #              }
        #              ... on EventChange {
        #                id
        #                ownedBy {
        #                  ... on Group {
        #                    id
        #                  }
        #                }
        #                createdAt
        #                updatedAt
        #                createdBy {
        #                  ... on User {
        #                    id
        #                    firstName
        #                    lastName
        #                  }
        #                }
        #                updatedAt
        #                updatedBy {
        #                  ... on User {
        #                    id
        #                    firstName
        #                    lastName
        #                  }
        #                }
        #                adds {
        #                  entity {
        #                    __typename
        #                    ... on Batch {
        #                      id
        #                      no
        #                    }
        #                    ... on Model {
        #                      id
        #                    }
        #                  }
        #                }
        #                removes {
        #                  entity {
        #                    __typename
        #                    ... on Batch {
        #                      id
        #                      no
        #                    }
        #                    ... on Model {
        #                      id
        #                    }
        #                  }
        #                }
        #                updates {
        #                  entity {
        #                    __typename
        #                    ... on Batch {
        #                      id
        #                      no
        #                    }
        #                    ... on Model {
        #                      id
        #                    }
        #                  }
        #                  field
        #                  oldValue
        #                  newValue
        #                }
        #              }
        #            }
        #            page
        #            perPage
        #            totalPage
        #          }
        #        }
      }
    }
  }
`;

export default shipmentLogsListQuery;
