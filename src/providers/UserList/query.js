// @flow
import gql from 'graphql-tag';

export const userListQuery = gql`
  query($page: Int!, $perPage: Int!, $filterBy: UserFilterInput, $sortBy: UserSortInput) {
    users(page: $page, perPage: $perPage, filterBy: $filterBy, sortBy: $sortBy) {
      page
      totalPage
      nodes {
        ... on User {
          id
          firstName
          lastName
          email
          role
          tags {
            ... on Tag {
              id
              name
              color
            }
          }
        }
      }
    }
  }
`;

export default userListQuery;
