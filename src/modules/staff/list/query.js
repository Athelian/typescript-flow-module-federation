// @flow
import gql from 'graphql-tag';
import { staffCardFragment, tagFragment } from 'graphql';

export const staffListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: UserFilterInput, $sort: UserSortInput) {
    users(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
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
