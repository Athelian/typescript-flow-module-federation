// @flow
import gql from 'graphql-tag';
import { staffCardFragment, tagFragment, forbiddenFragment } from 'graphql';

export const staffListQuery = gql`
  query staffListQuery(
    $page: Int!
    $perPage: Int!
    $filterBy: UserFilterInput
    $sortBy: UserSortInput
  ) {
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
  ${forbiddenFragment}
`;

export default staffListQuery;
