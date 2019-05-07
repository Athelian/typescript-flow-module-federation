// @flow
import gql from 'graphql-tag';

export const orderItemAutoDateQuery = gql`
  query($id: ID!) {
    orderItem(id: $id) {
      ... on OrderItem {
        id
        order {
          ... on Order {
            id
            issuedAt
          }
        }
      }
    }
  }
`;

export default orderItemAutoDateQuery;
