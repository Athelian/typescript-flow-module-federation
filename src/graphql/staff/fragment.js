// @flow
import gql from 'graphql-tag';

export const staffFormFragment = gql`
  fragment staffFormFragment on User {
    id
  }
`;

export const staffCardFragment = gql`
  fragment staffCardFragment on User {
    id
    email
    roles {
      ... on Role {
        id
        name
      }
    }
    firstName
    lastName
    tags {
      ...tagFragment
      ...forbiddenFragment
    }
    organization {
      ... on Organization {
        id
        name
      }
    }
  }
`;
