// @flow
import gql from 'graphql-tag';
import { forbiddenFragment } from 'graphql';

export const importMutation = gql`
  mutation import($file: Upload!) {
    import(file: $file) {
      ... on Import {
        id
      }
      ...forbiddenFragment
    }
  }

  ${forbiddenFragment}
`;

export default importMutation;
