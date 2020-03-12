// @flow
import gql from 'graphql-tag';
import {
  documentFragment,
  tagFragment,
  badRequestFragment,
  forbiddenFragment,
  ownedByFragment,
} from 'graphql';

const fileUploadMutation = gql`
  mutation fileUpload($file: Upload!, $input: FileInput!) {
    fileUpload(file: $file, input: $input) {
      ...documentFragment
      ... on File {
        createdAt
      }
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
