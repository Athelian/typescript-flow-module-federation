// @flow
import gql from 'graphql-tag';
import { metricFragment, tagFragment, badRequestFragment } from 'graphql';

export const batchBalanceSplitMutation = gql`
  mutation batchBalanceSplit($orderItemId: ID!) {
    batchBalanceSplit(orderItemId: $orderItemId) {
      ... on Batches {
        batches {
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
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${metricFragment}
  ${tagFragment}
`;

export default batchBalanceSplitMutation;
