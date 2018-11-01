// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';

export const batchSimpleSplitMutation = gql`
  mutation batchSimpleSplit($id: ID!, $input: BatchSimpleSplitInput!) {
    batchSimpleSplit(id: $id, input: $input) {
      batches {
        id
        orderItem {
          id
        }
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
`;

export const batchEqualSplitMutaion = gql`
  mutation batchEqualSplit($id: ID!, $input: BatchEqualSplitInput!) {
    batchEqualSplit(id: $id, input: $input) {
      batches {
        id
        orderItem {
          id
        }
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
`;

export const batchBalanceSplitMutaion = gql`
  mutation batchBalanceSplit($orderItemId: ID!) {
    batchBalanceSplit(orderItemId: $orderItemId) {
      batches {
        id
        orderItem {
          id
        }
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
`;
