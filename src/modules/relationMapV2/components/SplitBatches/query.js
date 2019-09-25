import gql from 'graphql-tag';
import { forbiddenFragment } from 'graphql';

export const ordersByIDsQuery = gql`
  query ordersByIDs($ids: [ID!]!) {
    ordersByIDs(ids: $ids) {
      ...forbiddenFragment
      ... on Order {
        id
        tags {
          ... on Tag {
            id
          }
        }
      }
    }
  }
  ${forbiddenFragment}
`;

export const orderItemsByIDsQuery = gql`
  query orderItemsByIDs($ids: [ID!]!) {
    orderItemsByIDs(ids: $ids) {
      ...forbiddenFragment
      ... on OrderItem {
        id
        tags {
          ... on Tag {
            id
          }
        }
      }
    }
  }
  ${forbiddenFragment}
`;

export const batchesByIDsQuery = gql`
  query batchesByIDs($ids: [ID!]!) {
    batchesByIDs(ids: $ids) {
      ...forbiddenFragment
      ... on Batch {
        id
        tags {
          ... on Tag {
            id
          }
        }
      }
    }
  }
  ${forbiddenFragment}
`;

export const containersByIDsQuery = gql`
  query containersByIDs($ids: [ID!]!) {
    containersByIDs(ids: $ids) {
      ...forbiddenFragment
      ... on Container {
        id
        tags {
          ... on Tag {
            id
          }
        }
      }
    }
  }
  ${forbiddenFragment}
`;

export const shipmentsByIDsQuery = gql`
  query shipmentsByIDs($ids: [ID!]!) {
    shipmentsByIDs(ids: $ids) {
      ...forbiddenFragment
      ... on Shipment {
        id
        tags {
          ... on Tag {
            id
          }
        }
      }
    }
  }
  ${forbiddenFragment}
`;
