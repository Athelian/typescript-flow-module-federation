// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const batchBalanceSplitManyMutation = gql`
  mutation batchBalanceSplitMany($orderItemIds: [ID!]!) {
    batchBalanceSplitMany(orderItemIds: $orderItemIds) {
      ... on Batches {
        batches {
          id
        }
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default batchBalanceSplitManyMutation;
