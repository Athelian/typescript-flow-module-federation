// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const updateOrdersMutation = gql`
  mutation orderUpdateMany($orders: [OrderUpdateWrapperInput!]!) {
    orderUpdateMany(orders: $orders) {
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

export const updateShipmentMutation = gql`
  mutation shipmentUpdateMany($shipments: [ShipmentUpdateWrapperInput!]!) {
    shipmentUpdateMany(shipments: $shipments) {
      ... on Shipment {
        id
        batches {
          ... on Batch {
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
      }
      ...badRequestFragment
      ...forbiddenFragment
    }
  }
  ${badRequestFragment}
  ${forbiddenFragment}
`;
