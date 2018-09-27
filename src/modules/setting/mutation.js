// @flow
import gql from 'graphql-tag';

export const logoutMutation = gql`
  mutation {
    logout
  }
`;

export default logoutMutation;
