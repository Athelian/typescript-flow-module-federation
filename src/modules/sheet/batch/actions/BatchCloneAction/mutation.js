// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

const cloneBatchActionMutation = gql`
  mutation cloneBatchActionMutation($id: ID!, $input: BatchUpdateInput!) {
    batchClone(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default cloneBatchActionMutation;
