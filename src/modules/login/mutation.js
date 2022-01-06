// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';

export const loginMutation = gql`
  mutation($input: CredentialsInput!) {
    login(input: $input) {
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;

export const requestOneTimePasswordMutation = gql`
  mutation requestOneTimePassword($type: OneTimePasswordType!) {
    requestOneTimePassword(type: $type) {
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;

export const verifyOneTimePasswordMutation = gql`
  mutation verifyOneTimePassword($code: String!) {
    verifyOneTimePassword(code: $code) {
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;
export default loginMutation;
