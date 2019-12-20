// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment, imageFragment } from 'graphql';

const fileUploadMutation = gql`
  mutation fileUpload($file: Upload!, $input: FileInput!) {
    fileUpload(file: $file, input: $input) {
      ...imageFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${imageFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default fileUploadMutation;
