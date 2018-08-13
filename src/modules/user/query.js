// @flow
import gql from 'graphql-tag';

export const userDetailQuery = gql`
  query {
    viewer {
      permissions
      user {
        id
        email
        firstName
        lastName
        language
        timezone
        role
        group {
          id
          name
          name2
          type
          partners(page: 1, perPage: 1000) {
            nodes {
              id
              name
              name2
              type
            }
          }
        }
      }
    }
  }
`;

export default userDetailQuery;
