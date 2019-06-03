// @flow
import gql from 'graphql-tag';

export const authenticationQuery = gql`
  query authenticationQuery {
    authenticated
  }
`;

export default authenticationQuery;
