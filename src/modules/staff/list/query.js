// @flow
import gql from 'graphql-tag';
import { staffCardFragment, tagFragment } from 'graphql';

export const staffListQuery = gql`
  query users($page: Int!, $perPage: Int!, $filterBy: UserFilterInput, $sortBy: UserSortInput) {
    users(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      nodes {
        ...staffCardFragment
      }
      page
      totalPage
    }
  }

  ${staffCardFragment}
  ${tagFragment}
`;

export default staffListQuery;
