// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

const sheetProductProviderMutation = gql`
  mutation sheetProductProviderMutation($id: ID!, $input: ProductProviderUpdateInput!) {
    productProviderUpdate(id: $id, input: $input) {
      ...forbiddenFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default sheetProductProviderMutation;
