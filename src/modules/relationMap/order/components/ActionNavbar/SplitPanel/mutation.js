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
            batchAdjustments {
              ... on BatchAdjustment {
                id
                reason
                quantity
                memo
              }
            }
            tags {
              ...tagFragment
            }
            packageVolume {
              ...metricFragment
            }
            orderItem {
              ... on OrderItem {
                id
              }
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
            batchAdjustments {
              ... on BatchAdjustment {
                id
                reason
                quantity
                memo
              }
            }
            packageVolume {
              ...metricFragment
            }
            tags {
              ...tagFragment
            }
            orderItem {
              ... on OrderItem {
                id
              }
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
