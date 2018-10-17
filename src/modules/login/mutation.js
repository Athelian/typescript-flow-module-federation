// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';

export const loginMutation = gql`
  mutation($input: CredentialsInput!) {
    login(input: $input) {
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

export default loginMutation;
