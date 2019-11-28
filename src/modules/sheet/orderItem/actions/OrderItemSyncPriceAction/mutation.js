// @flow
import gql from 'graphql-tag';
import { forbiddenFragment, badRequestFragment } from 'graphql';

export const syncPriceOrderItemActionMutation = gql`
  mutation syncPriceOrderItemActionMutation($id: ID!, $input: OrderItemUpdateInput!) {
    orderItemUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export default syncPriceOrderItemActionMutation;
