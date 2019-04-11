// @flow
import gql from 'graphql-tag';

export const orderAutoDateQuery = gql`
  query($id: ID!) {
    order(id: $id) {
      ... on Order {
        id
        issuedAt
      }
    }
  }
`;

export default orderAutoDateQuery;
