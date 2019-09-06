// @flow
import gql from 'graphql-tag';
import { badRequestFragment, taskCountFragment, ownedByFragment, forbiddenFragment } from 'graphql';

// TODO: need to reuse the fragment when doing the batch card
export const createBatchMutation = gql`
  mutation batchCreate($input: BatchCreateInput!) {
    batchCreate(input: $input) {
      ... on Batch {
        id
        updatedAt
        createdAt
        deliveredAt
        expiredAt
        desiredAt
        ownedBy {
          ...ownedByFragment
        }
        archived
        no
        latestQuantity
        orderItem {
          ... on OrderItem {
            id
            order {
              ... on Order {
                id
              }
            }
          }
        }
        todo {
          taskCount {
            ...taskCountFragment
          }
        }
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${ownedByFragment}
  ${taskCountFragment}
  ${forbiddenFragment}
`;

export default createBatchMutation;
