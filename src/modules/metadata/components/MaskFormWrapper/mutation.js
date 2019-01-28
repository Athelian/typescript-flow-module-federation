// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';

export const createMaskMutation = gql`
  mutation maskCreate($input: MaskCreateInput!) {
    maskCreate(input: $input) {
      ... on Mask {
        id
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;

export const updateMaskMutation = gql`
  mutation maskUpdate($id: ID!, $input: MaskUpdateInput!) {
    maskUpdate(id: $id, input: $input) {
      ... on Mask {
        id
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;
