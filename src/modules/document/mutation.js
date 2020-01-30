// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const deleteManyFileMutation = gql`
  mutation fileDeleteMany($ids: [ID!]!) {
    fileDeleteMany(ids: $ids) {
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default deleteManyFileMutation;
