// @flow
import gql from 'graphql-tag';
import { forbiddenFragment } from 'graphql';

const deleteOrderItemActionMutation = gql`
  mutation deleteOrderItemActionMutation($id: ID!) {
    orderItemDelete(id: $id) {
      ...forbiddenFragment
    }
  }

  ${forbiddenFragment}
`;

export default deleteOrderItemActionMutation;
