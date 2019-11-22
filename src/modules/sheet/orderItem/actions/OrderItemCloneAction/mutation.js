// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

const cloneOrderItemActionMutation = gql`
  mutation cloneOrderItemActionMutation($id: ID!, $input: OrderItemUpdateInput!) {
    orderItemClone(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default cloneOrderItemActionMutation;
