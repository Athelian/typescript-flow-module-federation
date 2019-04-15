// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';

export const requestResetPasswordMutation = gql`
  mutation requestResetPassword($input: RequestResetPasswordInput!) {
    requestResetPassword(input: $input) {
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;

export default requestResetPasswordMutation;
