// @flow
import gql from 'graphql-tag';
import { staffCardFragment, tagFragment, forbiddenFragment } from 'graphql';

export const usersQuery = gql`
  query usersQuery(
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
  ${forbiddenFragment}
`;

export default usersQuery;
