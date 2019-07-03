// @flow
import gql from 'graphql-tag';

export const batchAutoDateQuery = gql`
  query batchAutoDateQuery($id: ID!) {
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

export default batchAutoDateQuery;
