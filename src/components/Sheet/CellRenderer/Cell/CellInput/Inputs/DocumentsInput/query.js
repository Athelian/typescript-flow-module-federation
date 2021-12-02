// @flow
import gql from 'graphql-tag';
import { forbiddenFragment, documentFragment, ownedByFragment, tagFragment } from 'graphql';

export const orderDocumentsQuery = gql`
  query ordersByIDs($ids: [ID!]!) {
    ordersByIDs(ids: $ids) {
      ... on Order {
        files {
          ...documentFragment
        }
        __typename
      }
    }
  }
  ${forbiddenFragment}
  ${documentFragment}
  ${ownedByFragment}
  ${tagFragment}
`;

export const orderItemDocumentsQuery = gql`
  query orderItemsByIDs($ids: [ID!]!) {
    orderItemsByIDs(ids: $ids) {
      ... on OrderItem {
        files {
          ...documentFragment
        }
        __typename
      }
    }
  }
  ${forbiddenFragment}
  ${documentFragment}
  ${ownedByFragment}
  ${tagFragment}
`;

export const productProviderDocumentsQuery = gql`
  query productProvidersByIDs($ids: [ID!]!) {
    productProvidersByIDs(ids: $ids) {
      ... on ProductProvider {
        files {
          ...documentFragment
        }
        __typename
      }
    }
  }
  ${forbiddenFragment}
  ${documentFragment}
  ${ownedByFragment}
  ${tagFragment}
`;

export const milestoneDocumentsQuery = gql`
  query milestonesByIDs($ids: [ID!]!) {
    milestonesByIDs(ids: $ids) {
      ... on Milestone {
        files {
          ...documentFragment
        }
        __typename
      }
    }
  }
  ${forbiddenFragment}
  ${documentFragment}
  ${ownedByFragment}
  ${tagFragment}
`;

export const shipmentDocumentsQuery = gql`
  query shipmentsByIDs($ids: [ID!]!) {
    shipmentsByIDs(ids: $ids) {
      ... on Shipment {
        files {
          ...documentFragment
        }
        __typename
      }
    }
  }
  ${forbiddenFragment}
  ${documentFragment}
  ${ownedByFragment}
  ${tagFragment}
`;
