// @flow
import gql from 'graphql-tag';

export const badRequestFragment = gql`
  fragment badRequestFragment on BadRequest {
    violations {
      message
      error
      code
      path
      parameters {
        key
        value
      }
    }
  }
`;

export const notFoundFragment = gql`
  fragment notFoundFragment on NotFound {
    reference {
      id
      type
      service
    }
  }
`;

export const forbiddenFragment = gql`
  fragment forbiddenFragment on Forbidden {
    reason
    reference {
      id
    }
  }
`;
