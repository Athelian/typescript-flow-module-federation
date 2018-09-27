// @flow
import gql from 'graphql-tag';

export const partnerListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: PartnerFilterInput, $sortBy: PartnerSortInput) {
    viewer {
      user {
        id
        group {
          id
          partners(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
            nodes {
              id
              group {
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
`;

export default partnerListQuery;
