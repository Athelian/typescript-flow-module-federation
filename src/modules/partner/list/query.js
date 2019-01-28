// @flow
import gql from 'graphql-tag';
import { partnerCardFragment } from 'graphql';

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

export default partnerListQuery;
