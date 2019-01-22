// @flow
import gql from 'graphql-tag';

export const partnerListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: PartnerFilterInput, $sortBy: PartnerSortInput) {
    viewer {
      user {
        ... on User {
          id
          group {
            ... on Group {
              id
              partners(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
                nodes {
                  ... on Partner {
                    id
                    group {
                      ... on Group {
                        id
                        name
                        types
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
