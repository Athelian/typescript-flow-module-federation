// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import { tableTemplateCardFragment, userAvatarFragment } from 'graphql';

export const maskEditCreateMutation = gql`
  mutation maskEditCreate($input: MaskEditCreateInput!) {
    maskEditCreate(input: $input) {
      maskEdit {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

export const maskEditUpdateMutation = gql`
  mutation maskEditUpdate($id: ID!, $input: MaskEditUpdateInput!) {
    maskEditUpdate(id: $id, input: $input) {
      maskEdit {
        ...tableTemplateCardFragment
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
  ${userAvatarFragment}
  ${tableTemplateCardFragment}
`;
