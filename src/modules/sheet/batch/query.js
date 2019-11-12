// @flow
import gql from 'graphql-tag';
import { sheetBatchQuantityRevisionFragment } from './fragment';

export const batchQuantityRevisionByIDQuery = gql`
  query batchQuantityRevisionByIDQuery($id: ID!) {
    batchQuantityRevision(id: $id) {
      ...sheetBatchQuantityRevisionFragment
      ... on BatchQuantityRevision {
        batch {
          ... on Batch {
            id
          }
        }
      }
    }
  }

  ${sheetBatchQuantityRevisionFragment}
`;
