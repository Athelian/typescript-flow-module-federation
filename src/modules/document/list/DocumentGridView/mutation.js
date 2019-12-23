// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const deleteFileMutation = gql`
  mutation fileDelete($id: ID!) {
    fileDelete(id: $id) {
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default deleteFileMutation;
