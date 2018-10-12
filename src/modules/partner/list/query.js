// @flow
import gql from 'graphql-tag';
import { partnerCardFragment } from 'graphql';

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
                ...partnerCardFragment
              }
            }
          }
        }
      }
    }
  }

  ${partnerCardFragment}
`;

export default partnerListQuery;
