// @flow
import gql from 'graphql-tag';
import { badRequestFragment, tableTemplateCardFragment, userAvatarFragment } from 'graphql';

export const maskEditCreateMutation = gql`
  mutation maskEditCreate($input: MaskEditCreateInput!) {
    maskEditCreate(input: $input) {
      ...tableTemplateCardFragment
      ...badRequestFragment
    }
  }

  ${badRequestFragment}
  ${userAvatarFragment}
  ${tableTemplateCardFragment}
`;

export const maskEditUpdateMutation = gql`
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
