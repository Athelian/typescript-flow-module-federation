// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';

export const deleteTagMutation = gql`
  mutation tagDelete($id: ID!) {
    tagDelete(id: $id) {
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;

export default deleteTagMutation;
