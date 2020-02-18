// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const deleteProductMutation: Object = gql`
  mutation productDelete($id: ID!) {
    productDelete(id: $id) {
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default deleteProductMutation;
