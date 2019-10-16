// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const cloneBatchesMutation = gql`
  mutation batchCloneMany($batches: [BatchUpdateWrapperInput!]!) {
    batchCloneMany(batches: $batches) {
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

export const cloneContainersMutation = gql`
  mutation containerCloneMany($containers: [ContainerUpdateWrapperInput!]!) {
    containerCloneMany(containers: $containers) {
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

export const cloneShipmentsMutation = gql`
  mutation shipmentCloneMany($shipments: [ShipmentUpdateWrapperInput!]!) {
    shipmentCloneMany(shipments: $shipments) {
      ... on Shipment {
        id
        batches {
          ... on Batch {
            id
          }
        }
        containers {
          ... on Container {
            id
          }
        }
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${forbiddenFragment}
  ${badRequestFragment}
`;

export const cloneOrderItemsMutation = gql`
  mutation orderItemCloneMany($orderItems: [OrderItemUpdateWrapperInput!]!) {
    orderItemCloneMany(orderItems: $orderItems) {
      ... on OrderItem {
        id
        batches {
          ... on Batch {
            id
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

export const cloneOrdersMutation = gql`
  mutation orderCloneMany($orders: [OrderUpdateWrapperInput!]!) {
    orderCloneMany(orders: $orders) {
      ... on Order {
        id
        orderItems {
          ... on OrderItem {
            id
            batches {
              ... on Batch {
                id
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
