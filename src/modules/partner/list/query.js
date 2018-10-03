// @flow
import gql from 'graphql-tag';

export const partnerListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: PartnerFilterInput, $sort: PartnerSortInput) {
    viewer {
      user {
        id
        group {
          id
          partners(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
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
