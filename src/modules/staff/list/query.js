// @flow
import gql from 'graphql-tag';

export const userListFragment = gql`
  fragment userListFields on User {
    id
    email
    role
    firstName
    lastName
    tags {
      id
      name
      description
      color
    }
    createdAt
    updatedAt
  }
`;

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
