// @flow
import gql from 'graphql-tag';

export const violationFragment = gql`
  fragment violationFragment on Violation {
    message
    error
    code
    path
    parameters {
      key
      value
    }
  }
`;

export default violationFragment;
