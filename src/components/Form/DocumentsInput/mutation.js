// @flow
import gql from 'graphql-tag';
import { documentFragment, badRequestFragment, forbiddenFragment } from 'graphql';

const fileUploadMutation = gql`
  mutation fileUpload($file: Upload!, $input: FileInput!) {
    fileUpload(file: $file, input: $input) {
      ...documentFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${documentFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default fileUploadMutation;
