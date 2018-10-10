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
    role
    firstName
    lastName
    tags {
      ...tagFragment
    }
  }
`;
