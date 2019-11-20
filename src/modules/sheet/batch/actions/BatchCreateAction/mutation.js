// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

const batchCreateActionMutation = gql`
  mutation batchCreateActionMutation($input: BatchCreateInput!) {
    batchCreate(input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default batchCreateActionMutation;
