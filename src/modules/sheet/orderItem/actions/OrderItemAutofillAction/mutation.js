// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

const autofillOrderItemActionMutation = gql`
  mutation autofillOrderItemActionMutation($id: ID!) {
    batchBalanceSplit(orderItemId: $id) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default autofillOrderItemActionMutation;
