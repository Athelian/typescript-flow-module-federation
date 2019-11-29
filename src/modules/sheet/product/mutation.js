// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

const sheetProductMutation = gql`
  mutation sheetProductMutation($id: ID!, $input: ProductUpdateInput!) {
    productUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default sheetProductMutation;
