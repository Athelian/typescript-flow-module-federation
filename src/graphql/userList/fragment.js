// @flow
import gql from 'graphql-tag';

export const userListFieldsFragment = gql`
  fragment userListFieldsFragment on User {
    id
    email
    role
    firstName
    lastName
    createdAt
    updatedAt
  }
`;

export default userListFieldsFragment;
