// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';

export const requestResetPasswordMutation = gql`
  mutation requestResetPassword {
    requestResetPassword(input: {}) {
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;

export const changePasswordMutation = gql`
  mutation changePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
`;
