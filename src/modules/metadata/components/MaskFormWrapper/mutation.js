// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';

export const createMaskMutation = gql`
  mutation maskCreate($input: MaskCreateInput!) {
    maskCreate(input: $input) {
      mask {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
`;

export const updateMaskMutation = gql`
  mutation maskUpdate($id: ID!, $input: MaskUpdateInput!) {
    maskUpdate(id: $id, input: $input) {
      mask {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
`;
