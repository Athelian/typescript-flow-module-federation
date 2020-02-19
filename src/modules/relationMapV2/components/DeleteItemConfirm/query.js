// @flow
import gql from 'graphql-tag';
import { forbiddenFragment } from 'graphql';

export const itemQuery = gql`
  query itemQuery($id: ID!) {
    orderItem(id: $id) {
      ... on OrderItem {
        id
        files {
          ... on File {
            id
          }
        }
      }
    }
  }
`;

export const itemsQuery = gql`
  query orderItemsByIDs($ids: [ID!]!) {
    orderItemsByIDs(ids: $ids) {
      ...forbiddenFragment
      ... on OrderItem {
        id
        files {
          ... on File {
            id
          }
        }
      }
    }
  }
  ${forbiddenFragment}
`;
