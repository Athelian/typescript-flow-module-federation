// @flow
import gql from 'graphql-tag';

export const userDetailQuery = gql`
  query {
    viewer {
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
          types
        }
      }
    }
  }
`;

export default userDetailQuery;
