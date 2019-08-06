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
  milestoneCardFragment,
  projectCardFragment,
  taskWithoutParentInfoFragment,
  taskFormInTemplateFragment,
  taskTemplateCardFragment,
  partnerNameFragment,
  forbiddenFragment,
  taskCountFragment,
} from 'graphql';
import {
  productProviderRMFragment,
  orderCardRMFragment,
  batchCardRMFragment,
  shipmentCardRMFragment,
} from 'modules/relationMap/order/query';

export const cloneBatchMutation = gql`
  mutation batchClone($id: ID!, $input: BatchUpdateInput!) {
    batchClone(id: $id, input: $input) {
      ...batchCardRMFragment
      ...badRequestFragment
      ...forbiddenFragment
    }
  }

  ${batchCardRMFragment}
  ${tagFragment}
  ${metricFragment}
  ${userAvatarFragment}
  ${taskFormInTemplateFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${taskCountFragment}
  ${badRequestFragment}
  ${forbiddenFragment}
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
  ${productProviderRMFragment}
  ${partnerNameFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${taskCountFragment}
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
              ... on Organization {
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
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskWithoutParentInfoFragment}
  ${taskCountFragment}
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
  ${productProviderRMFragment}
  ${timelineDateMinimalFragment}
  ${tagFragment}
  ${portFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${priceFragment}
  ${taskFormInTemplateFragment}
  ${milestoneCardFragment}
  ${projectCardFragment}
  ${taskWithoutParentInfoFragment}
  ${taskTemplateCardFragment}
  ${taskCountFragment}
`;
