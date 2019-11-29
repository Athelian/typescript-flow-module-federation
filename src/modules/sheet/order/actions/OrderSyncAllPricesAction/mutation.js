// @flow
import gql from 'graphql-tag';
import { forbiddenFragment, badRequestFragment } from 'graphql';

export const syncAllPricesOrderActionMutation = gql`
  mutation syncAllPricesOrderActionMutation($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export default syncAllPricesOrderActionMutation;
