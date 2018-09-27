// @flow
import gql from 'graphql-tag';

export const userListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: UserFilterInput, $sortBy: UserSortInput) {
    users(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      page
      totalPage
      nodes {
        id
        firstName
        lastName
        email
        role
      }
    }
  }
`;

export default userListQuery;
