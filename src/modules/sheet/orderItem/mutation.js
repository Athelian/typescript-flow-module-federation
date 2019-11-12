// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

const sheetOrderItemMutation = gql`
  mutation sheetOrderItemMutation($id: ID!, $input: OrderItemUpdateInput!) {
    orderItemUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default sheetOrderItemMutation;
