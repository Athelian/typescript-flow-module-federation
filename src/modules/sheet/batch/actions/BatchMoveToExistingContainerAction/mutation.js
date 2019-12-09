// @flow
import gql from 'graphql-tag';
import { forbiddenFragment, badRequestFragment } from 'graphql';

export const batchMoveToExistingContainerActionMutation = gql`
  mutation batchMoveToExistingContainerActionMutation($id: ID!, $input: BatchUpdateInput!) {
    batchUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }
  ${forbiddenFragment}
  ${badRequestFragment}
`;

export default batchMoveToExistingContainerActionMutation;
