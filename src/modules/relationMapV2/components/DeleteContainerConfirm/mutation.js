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

export default deleteContainerMutation;
