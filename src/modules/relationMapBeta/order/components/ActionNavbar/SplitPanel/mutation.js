// @flow
import gql from 'graphql-tag';
import { metricFragment, tagFragment, badRequestFragment } from 'graphql';

export const batchSimpleSplitMutation = gql`
  mutation batchSimpleSplit($id: ID!, $input: BatchSimpleSplitInput!) {
    batchSimpleSplit(id: $id, input: $input) {
      ... on Batches {
        batches {
          ... on Batch {
            id
            no
            quantity
            totalAdjusted
            tags {
              ...tagFragment
            }
            packageVolume {
              ...metricFragment
            }
          }
        }
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${metricFragment}
  ${tagFragment}
`;

export const batchEqualSplitMutation = gql`
  mutation batchEqualSplit($id: ID!, $input: BatchEqualSplitInput!) {
    batchEqualSplit(id: $id, input: $input) {
      ... on Batches {
        batches {
          ... on Batch {
            id
            no
            quantity
            totalAdjusted
            packageVolume {
              ...metricFragment
            }
            tags {
              ...tagFragment
            }
          }
        }
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${metricFragment}
  ${tagFragment}
`;
