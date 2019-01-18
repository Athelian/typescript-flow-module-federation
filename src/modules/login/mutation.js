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

export default loginMutation;
