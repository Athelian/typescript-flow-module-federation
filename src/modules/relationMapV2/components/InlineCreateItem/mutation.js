// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const createOrderItemMutation = gql`
  mutation orderItemCreate($input: OrderItemCreateInput!) {
    orderItemCreate(input: $input) {
      ... on OrderItem {
        id
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default createOrderItemMutation;
