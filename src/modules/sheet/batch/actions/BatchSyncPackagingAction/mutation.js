// @flow
import gql from 'graphql-tag';
import { forbiddenFragment, badRequestFragment } from 'graphql';

export const syncPackagingBatchActionMutation = gql`
  mutation syncPackagingBatchActionMutation($id: ID!, $input: BatchUpdateInput!) {
    batchUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${forbiddenFragment}
  ${badRequestFragment}
`;

export default syncPackagingBatchActionMutation;
