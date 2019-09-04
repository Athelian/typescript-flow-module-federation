// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const cloneBatchMutation = gql`
  mutation batchClone($id: ID!, $input: BatchUpdateInput!) {
    batchClone(id: $id, input: $input) {
      ... on Batch {
        id
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const cloneContainerMutation = gql`
  mutation containerClone($id: ID!, $input: BatchUpdateInput!) {
    containerClone(id: $id, input: $input) {
      ... on Container {
        id
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const cloneShipmentMutation = gql`
  mutation shipmentClone($id: ID!, $input: ShipmentUpdateInput!) {
    shipmentClone(id: $id, input: $input) {
      ... on Shipment {
        id
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${forbiddenFragment}
  ${badRequestFragment}
`;

export const cloneOrderItemMutation = gql`
  mutation orderItemClone($id: ID!, $input: OrderItemUpdateInput!) {
    orderItemClone(id: $id, input: $input) {
      ... on OrderItem {
        id
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export const cloneOrderMutation = gql`
  mutation orderClone($id: ID!, $input: OrderUpdateInput!) {
    orderClone(id: $id, input: $input) {
      ... on Order {
        id
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;
