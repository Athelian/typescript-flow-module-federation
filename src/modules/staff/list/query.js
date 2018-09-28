// @flow
import gql from 'graphql-tag';

export const staffListQuery = gql`
  query($page: Int!, $perPage: Int!, $filter: UserFilterInput, $sort: UserSortInput) {
    users(page: $page, perPage: $perPage, filterBy: $filter, sortBy: $sort) {
      nodes {
        id
      }
      page
      totalPage
    }
  }
`;

export default staffListQuery;
