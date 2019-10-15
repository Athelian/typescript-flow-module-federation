// @flow
import gql from 'graphql-tag';
import { partnerCardFragment } from 'graphql';

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
                  ... on Partner {
                    id
                    organization {
                      ...partnerCardFragment
                    }
                  }
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
`;

export const organizationsByIDsQuery = gql`
  query organizationsByIDs($ids: [ID!]!) {
    organizationsByIDs(ids: $ids) {
      ... on Organization {
        id
        name
        partner {
          ... on Partner {
            id
            name
          }
        }
      }
    }
  }
`;
