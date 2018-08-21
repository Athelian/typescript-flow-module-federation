// @flow
import gql from 'graphql-tag';

// eslint-disable-next-line import/prefer-default-export
export const userListFragment = gql`
  fragment userListFields on User {
    id
    email
    role
    firstName
    lastName
    createdAt
    updatedAt
  }
`;

/*
export const userListQuery = gql`
  query users($page: Int!, $perPage: Int!) {
    viewer {
      group {
        users(page: $page, perPage: $perPage) {
          nodes {
            ...userListFields
          }
        }
      }
    }
  }

  ${userListFragment}
`;
*/
