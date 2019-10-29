// @flow
import gql from 'graphql-tag';
import { badRequestFragment, tableTemplateCardFragment, userAvatarFragment } from 'graphql';

export const maskEditUpdateMutation: Object = gql`
  mutation maskEditUpdate($id: ID!, $input: MaskEditUpdateInput!) {
    maskEditUpdate(id: $id, input: $input) {
      ...tableTemplateCardFragment
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${userAvatarFragment}
  ${tableTemplateCardFragment}
`;
