// @flow
import gql from 'graphql-tag';
import {
  metricFragment,
  tagFragment,
  badRequestFragment,
  userAvatarFragment,
  timelineDateMinimalFragment,
  portFragment,
  priceFragment,
} from 'graphql';
import { batchCardRMFragment, shipmentCardRMFragment } from 'modules/relationMapBeta/order/query';

export const cloneBatchMutation = gql`
  mutation batchClone($id: ID!, $input: BatchUpdateInput!) {
    batchClone(id: $id, input: $input) {
      ...batchCardRMFragment
      ...badRequestFragment
    }
  }

  ${batchCardRMFragment}
  ${tagFragment}
  ${metricFragment}
  ${badRequestFragment}
`;

export const cloneShipmentMutation = gql`
  mutation shipmentClone($id: ID!, $input: ShipmentUpdateInput!) {
    shipmentClone(id: $id, input: $input) {
      ... on Shipment {
        id
        batches {
          ... on Batch {
            id
          }
        }
      }
      ...shipmentCardRMFragment
      ...badRequestFragment
    }
  }

  ${shipmentCardRMFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${tagFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${badRequestFragment}
`;

export const cloneOrderItemMutation = gql`
  mutation orderItemClone($id: ID!, $input: OrderItemUpdateInput!) {
    orderItemClone(id: $id, input: $input) {
      ... on OrderItem {
        id
        quantity
        price {
          ...priceFragment
        }
        productProvider {
          ... on ProductProvider {
            id
            product {
              ... on Product {
                id
                name
                serial
              }
            }
            exporter {
              ... on Group {
                id
                name
              }
            }
          }
        }
        batches {
          ...batchCardRMFragment
        }
      }
      ...badRequestFragment
    }
  }

  ${batchCardRMFragment}
  ${badRequestFragment}
  ${priceFragment}
  ${tagFragment}
  ${metricFragment}
`;
