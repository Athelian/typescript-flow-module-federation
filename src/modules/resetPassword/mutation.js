// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';

export const resetPasswordMutation = gql`
  mutation resetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;

export default resetPasswordMutation;
