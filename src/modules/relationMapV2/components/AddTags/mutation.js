// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const orderUpdateManyMutation = gql`
  mutation orderUpdateMany($orders: [OrderUpdateWrapperInput!]!) {
    orderUpdateMany(orders: $orders) {
      ... on Order {
        id
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const orderItemUpdateManyMutation = gql`
  mutation orderItemUpdateMany($orderItems: [OrderItemUpdateWrapperInput!]!) {
    orderItemUpdateMany(orderItems: $orderItems) {
      ... on OrderItem {
        id
        order {
          ... on Order {
            id
          }
        }
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;
