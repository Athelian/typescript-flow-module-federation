// @flow
import gql from 'graphql-tag';
import { staffCardFragment, tagFragment } from 'graphql';

export const userListQuery = gql`
  query userListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: UserFilterInput
    $sortBy: UserSortInput
  ) {
    users(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      page
      totalPage
      nodes {
        ...staffCardFragment
      }
    }
  }

  ${staffCardFragment}
  ${tagFragment}
`;

export default userListQuery;
