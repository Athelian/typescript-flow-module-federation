// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const deleteContainerMutation = gql`
  mutation containerDelete($id: ID!) {
    containerDelete(id: $id) {
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const deleteOrderItemMutation = gql`
  mutation orderItemDelete($id: ID!) {
    orderItemDelete(id: $id) {
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;
