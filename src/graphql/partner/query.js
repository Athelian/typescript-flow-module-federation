// @flow
import gql from 'graphql-tag';

export const partnersQuery = gql`
  query partnersQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: PartnerFilterInput
    $sortBy: PartnerSortInput
  ) {
    viewer {
      user {
        ... on User {
          id
          organization {
            ... on Organization {
              id
              partners(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
                page
                totalPage
                nodes {
                  ... on Partner {
                    id
                    code
                    organization {
                      ... on Organization {
                        id
                        name
                        types
                        partner {
                          ... on Partner {
                            id
                            code
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
