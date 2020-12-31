// @flow
import gql from 'graphql-tag';
import { partnerCardFragment, tagFragment } from 'graphql';

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
          organization {
            ... on Organization {
              id
              types
              partners(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
                nodes {
                  ...partnerCardFragment
                }
                page
                totalPage
              }
            }
          }
        }
      }
    }
  }

  ${partnerCardFragment}
  ${tagFragment}
`;

export default partnerListQuery;
