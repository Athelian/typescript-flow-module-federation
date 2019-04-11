// @flow
import gql from 'graphql-tag';

export const batchDetailQuery = gql`
  query($id: ID!) {
    batch(id: $id) {
      ... on Batch {
        id
        deliveredAt
        desiredAt
        expiredAt
        producedAt
      }
    }
  }
`;

export default batchDetailQuery;
