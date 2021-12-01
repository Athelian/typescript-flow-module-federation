// @flow
import gql from 'graphql-tag';

export const documentFormFragment = gql`
  fragment documentFormFragment on File {
    id
    updatedAt
    updatedBy {
      ...userAvatarFragment
    }
    ownedBy {
      ...ownedByFragment
    }
    tags {
      ...tagFragment
      ...forbiddenFragment
    }
    name
    type
    status
    size
    path
    entity {
      ... on Model {
        id
      }
    }
    order: entity {
      ... on Model {
        id
      }
      ... on Order {
        ...orderCardFragment
      }
    }
    orderItem: entity {
      ... on Model {
        id
      }
      ... on OrderItem {
        ...itemCardFragment
      }
    }
    shipment: entity {
      ... on Model {
        id
      }
      ... on Shipment {
        ...shipmentCardFragment
      }
    }
    productProvider: entity {
      ... on Model {
        id
      }
      ... on ProductProvider {
        ...productProviderCardFragment
      }
    }
    milestone: entity {
      ... on Model {
        id
      }
      ... on Milestone {
        ...milestoneCardFragment
      }
    }
    memo
  }
`;

export const documentSummaryFragment = gql`
  fragment documentSummaryFragment on File {
    id
    name
    type
    size
    memo
    createdAt
    __typename
  }
`;
