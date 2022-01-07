// @flow
import gql from 'graphql-tag';

export const viewerQuery = gql`
  query viewerQuery {
    viewer {
      user {
        ... on User {
          id
          email
          firstName
          lastName
          language
          timezone
          mfaType
          organization {
            ... on Organization {
              id
              name
              name2
              types
            }
          }
        }
      }
    }
  }
`;

export const authenticationQuery = gql`
  query authenticationQuery {
    authenticated
    authenticatedWithMFA {
      ... on Authenticated {
        authenticated
        authenticatedMfa
        mfaType
      }
    }
  }
`;
