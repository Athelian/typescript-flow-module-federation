// @flow
import gql from 'graphql-tag';

export const userListFieldsFragment = gql`
  fragment userListFieldsFragment on User {
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

export default userListFieldsFragment;
