// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import type { BatchNew, BatchDetail } from '../type.js.flow';

export const createBatchMutation = gql`
  mutation batchCreate($input: BatchCreateInput!) {
    batchCreate(input: $input) {
      batch {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

export const prepareCreateBatchInput = ({ tags, orderItem, ...data }: BatchNew) => ({
  ...data,
  orderItemId: orderItem.id,
  tagIds: tags ? tags.map(t => t.id) : null,
});

export const updateBatchMutation = gql`
  mutation batchUpdate($id: ID!, $input: BatchUpdateInput!) {
    batchUpdate(id: $id, input: $input) {
      batch {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${violationFragment}
`;

export const prepareUpdateBatchInput = ({ tags, ...data }: BatchDetail) => ({
  ...data,
  tagIds: tags ? tags.map(t => t.id) : null,
});
