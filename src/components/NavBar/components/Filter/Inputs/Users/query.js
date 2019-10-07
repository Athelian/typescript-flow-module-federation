// @flow
import gql from 'graphql-tag';

export const usersByIDsQuery = gql`
  query usersByIDs($ids: [ID!]!) {
    usersByIDs(ids: $ids) {
      ... on User {
        id
        firstName
        lastName
        avatar {
          ... on File {
            id
            path
          }
        }
      }
    }
  }
`;
