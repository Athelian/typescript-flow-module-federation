// @flow
import gql from 'graphql-tag';

export const orderItemAutoDateQuery = gql`
  query orderItemAutoDateQuery($id: ID!) {
    orderItem(id: $id) {
      ... on OrderItem {
        id
        order {
          ... on Order {
            id
            issuedAt
            deliveryDate
          }
        }
      }
    }
  }
`;

export default orderItemAutoDateQuery;
