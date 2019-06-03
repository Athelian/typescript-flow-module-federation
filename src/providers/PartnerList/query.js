// @flow
import gql from 'graphql-tag';

export const partnerListQuery = gql`
  query partnerListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: PartnerFilterInput
    $sortBy: PartnerSortInput
  ) {
    viewer {
      user {
        ... on User {
          id
          group {
            ... on Group {
              id
              partners(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
                page
                totalPage
                nodes {
                  ... on Partner {
                    id
                    code
                    group {
                      ... on Group {
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

export default partnerListQuery;
