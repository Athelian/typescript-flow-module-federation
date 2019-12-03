// @flow
import gql from 'graphql-tag';
import { forbiddenFragment, badRequestFragment } from 'graphql';

export const batchMoveToExistingOrderActionMutation = gql`
  mutation batchMoveToExistingOrderActionMutation($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export default batchMoveToExistingOrderActionMutation;
