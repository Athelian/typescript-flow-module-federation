// @flow
import gql from 'graphql-tag';
import { partnerCardFragment, tagFragment } from 'graphql';

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

export default partnersQuery;
