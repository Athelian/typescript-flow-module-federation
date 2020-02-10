// @flow
import gql from 'graphql-tag';
import {
  documentFragment,
  tagFragment,
  badRequestFragment,
  forbiddenFragment,
  ownedByFragment,
} from 'graphql';

export const fileUploadMutation = gql`
  mutation fileUpload($file: Upload!, $input: FileInput!) {
    fileUpload(file: $file, input: $input) {
      ...documentFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${documentFragment}
  ${tagFragment}
  ${ownedByFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default fileUploadMutation;
