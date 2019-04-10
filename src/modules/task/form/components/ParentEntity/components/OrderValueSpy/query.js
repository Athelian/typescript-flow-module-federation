// @flow
import gql from 'graphql-tag';

export const orderDetailQuery = gql`
  query($id: ID!) {
    order(id: $id) {
      ... on Order {
        id
        issuedAt
      }
    }
  }
`;

export default orderDetailQuery;
