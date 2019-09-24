// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const batchSimpleSplitMutation = gql`
  mutation batchSimpleSplit($id: ID!, $input: BatchSimpleSplitInput!) {
    batchSimpleSplit(id: $id, input: $input) {
      ... on Batches {
        batches {
          id
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
        }
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default batchSimpleSplitMutation;
