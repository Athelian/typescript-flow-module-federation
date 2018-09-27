// @flow
import gql from 'graphql-tag';

export const authenticationQuery = gql`
  query {
    authenticated
  }
`;

export default authenticationQuery;
