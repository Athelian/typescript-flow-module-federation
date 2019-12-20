// @flow
import gql from 'graphql-tag';
import { documentFragment, badRequestFragment, forbiddenFragment, ownedByFragment } from 'graphql';

const fileUploadMutation = gql`
  mutation fileUpload($file: Upload!, $input: FileInput!) {
    fileUpload(file: $file, input: $input) {
      ...documentFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${documentFragment}
  ${ownedByFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default fileUploadMutation;
