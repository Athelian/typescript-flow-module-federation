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
  orderFormFragment,
  orderCardFragment,
  userAvatarFragment,
  documentFragment,
  shipmentCardFragment,
  shipmentFormFragment,
  timelineDateMinimalFragment,
  timelineDateFullFragment,
  portFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
} from 'graphql';
import { violationFragment } from 'graphql/violations/fragment';
import { orderItemRmFragment } from './query';

export const cloneOrderMutation: Object = gql`
  mutation orderCreate($input: OrderCreateInput!) {
    orderCreate(input: $input) {
      order {
        ...orderFormFragment
        orderItems {
          ...orderItemRmFragment
        }
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
  ${orderFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${partnerCardFragment}
  ${documentFragment}
  ${shipmentCardFragment}
  ${priceFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${batchFormFragment}
  ${metricFragment}
  ${sizeFragment}
  ${orderCardFragment}
  ${violationFragment}
  ${batchCardFragment}
  ${orderItemRmFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;

export const cloneOrderItemMutation: Object = gql`
  mutation orderUpdate($id: ID!, $input: OrderUpdateInput!) {
    orderUpdate(id: $id, input: $input) {
      order {
        ...orderFormFragment
        orderItems {
          ...orderItemRmFragment
        }
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
  ${orderFormFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${partnerCardFragment}
  ${documentFragment}
  ${shipmentCardFragment}
  ${priceFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${batchFormFragment}
  ${metricFragment}
  ${sizeFragment}
  ${orderCardFragment}
  ${violationFragment}
  ${batchCardFragment}
  ${orderItemRmFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;

export const cloneBatchMutation: Object = gql`
  mutation batchCreate($input: BatchCreateInput!) {
    batchCreate(input: $input) {
      batch {
        ...batchFormFragment
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
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
      shipment {
        ...shipmentFormFragment
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
  ${shipmentFormFragment}
  ${timelineDateFullFragment}
  ${batchFormFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${sizeFragment}
  ${tagFragment}
  ${priceFragment}
  ${orderCardFragment}
  ${imageFragment}
  ${partnerNameFragment}
  ${shipmentCardFragment}
  ${timelineDateMinimalFragment}
  ${portFragment}
  ${documentFragment}
  ${partnerCardFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;
