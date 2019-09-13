// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const deleteBatchMutation = gql`
  mutation batchDelete($id: ID!) {
    batchDelete(id: $id) {
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default deleteBatchMutation;
