// @flow
import gql from 'graphql-tag';

export const userDetailQuery = gql`
  query userDetailQuery {
    viewer {
      user {
        ... on User {
          id
          email
          firstName
          lastName
          language
          timezone
          organization {
            ... on Organization {
              id
              types
              name
              name2
              types
            }
          }
        }
      }
      permissions
    }
  }
`;

export default userDetailQuery;
