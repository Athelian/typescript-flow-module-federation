// @flow
import gql from 'graphql-tag';
import {
  sizeFragment,
  metricFragment,
  batchCardFragment,
  batchFormFragment,
  tagFragment,
  priceFragment,
  imageFragment,
  partnerNameFragment,
  partnerCardFragment,
  orderBasicFragment,
  orderCardFragment,
  userAvatarFragment,
  documentFragment,
  shipmentCardFragment,
  timelineDateMinimalFragment,
  timelineDateFullFragment,
  portFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  badRequestFragment,
} from 'graphql';
import { orderItemRmFragment, shipmentRMFragment } from './query';

export const cloneOrderMutation: Object = gql`
  mutation orderCreate($input: OrderCreateInput!) {
    orderCreate(input: $input) {
      ...orderBasicFragment
      ... on Order {
        orderItems {
          ...orderItemRmFragment
        }
        shipments {
          ...shipmentRMFragment
        }
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${orderBasicFragment}
  ${userAvatarFragment}
  ${sizeFragment}
  ${metricFragment}
  ${batchCardFragment}
  ${tagFragment}
  ${priceFragment}
  ${portFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${partnerCardFragment}
  ${documentFragment}
  ${orderCardFragment}
  ${orderItemRmFragment}
  ${shipmentRMFragment}
  ${batchFormFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${timelineDateFullFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;

export const cloneOrderItemMutation: Object = gql`
  mutation orderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      ...orderBasicFragment
      ... on Order {
        orderItems {
          ...orderItemRmFragment
        }
        shipments {
          ...shipmentRMFragment
        }
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${orderBasicFragment}
  ${userAvatarFragment}
  ${sizeFragment}
  ${metricFragment}
  ${batchCardFragment}
  ${tagFragment}
  ${priceFragment}
  ${portFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${partnerCardFragment}
  ${documentFragment}
  ${orderCardFragment}
  ${orderItemRmFragment}
  ${shipmentRMFragment}
  ${batchFormFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${timelineDateFullFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;

export const cloneBatchMutation: Object = gql`
  mutation batchCreate($input: BatchCreateInput!) {
    batchCreate(input: $input) {
      ...batchFormFragment
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${batchFormFragment}
  ${metricFragment}
  ${tagFragment}
  ${priceFragment}
  ${sizeFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${partnerCardFragment}
  ${userAvatarFragment}
  ${shipmentCardFragment}
  ${portFragment}
  ${timelineDateMinimalFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;

export const cloneShipmentMutation: Object = gql`
  mutation shipmentCreate($input: ShipmentCreateInput!) {
    shipmentCreate(input: $input) {
      ...shipmentRMFragment
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${shipmentRMFragment}
  ${timelineDateFullFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${tagFragment}
  ${portFragment}
  ${partnerCardFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;

export const updateBatchWithReturnDataMutation = gql`
  mutation batchUpdate($id: ID!, $input: BatchUpdateInput!) {
    batchUpdate(id: $id, input: $input) {
      ...batchCardFragment
      ... on Batch {
        packageSize {
          ...sizeFragment
        }
        shipment {
          ...shipmentRMFragment
        }
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
  ${batchCardFragment}
  ${metricFragment}
  ${sizeFragment}
  ${tagFragment}
  ${priceFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${partnerCardFragment}
  ${shipmentRMFragment}
  ${timelineDateFullFragment}
  ${userAvatarFragment}
  ${portFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;
