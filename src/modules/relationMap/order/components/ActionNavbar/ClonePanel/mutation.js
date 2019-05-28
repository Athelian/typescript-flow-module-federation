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
  taskFormInSlideViewFragment,
  taskFormInTemplateFragment,
  taskTemplateCardFragment,
  partnerNameFragment,
} from 'graphql';
import {
  orderCardRMFragment,
  batchCardRMFragment,
  shipmentCardRMFragment,
} from 'modules/relationMap/order/query';

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
  ${userAvatarFragment}
  ${taskFormInTemplateFragment}
  ${taskFormInSlideViewFragment}
  ${taskTemplateCardFragment}
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
  ${partnerNameFragment}
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
  ${userAvatarFragment}
  ${taskFormInTemplateFragment}
  ${taskFormInSlideViewFragment}
  ${taskTemplateCardFragment}
`;

export const cloneOrderMutation = gql`
  mutation orderClone($id: ID!, $input: OrderUpdateInput!) {
    orderClone(id: $id, input: $input) {
      ...orderCardRMFragment
    }
  }

  ${shipmentCardRMFragment}
  ${partnerNameFragment}
  ${batchCardRMFragment}
  ${orderCardRMFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${priceFragment}
  ${taskFormInTemplateFragment}
  ${taskFormInSlideViewFragment}
  ${taskTemplateCardFragment}
`;
