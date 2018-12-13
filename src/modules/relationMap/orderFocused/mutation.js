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
} from 'graphql';
import { violationFragment } from 'graphql/violations/fragment';
import { orderItemRmFragment, shipmentRMFragment } from './query';

export const cloneOrderMutation: Object = gql`
  mutation orderCreate($input: OrderCreateInput!) {
    orderCreate(input: $input) {
      order {
        ...orderBasicFragment
        orderItems {
          ...orderItemRmFragment
        }
        shipments {
          ...shipmentRMFragment
        }
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
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
      order {
        ...orderBasicFragment
        orderItems {
          ...orderItemRmFragment
          order {
            ...orderCardFragment
            orderItems {
              id
              batches {
                id
              }
            }
          }
        }
        shipments {
          ...shipmentRMFragment
        }
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
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
      batch {
        ...batchFormFragment
        orderItem {
          id
          price {
            ...priceFragment
          }
          order {
            ...orderCardFragment
            orderItems {
              id
              batches {
                id
              }
            }
          }
          productProvider {
            id
            product {
              id
              name
              serial
            }
            exporter {
              ...partnerNameFragment
            }
            supplier {
              ...partnerNameFragment
            }
          }
        }
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
        ...shipmentRMFragment
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
  ${shipmentRMFragment}
  ${timelineDateFullFragment}
  ${userAvatarFragment}
  ${metricFragment}
  ${tagFragment}
  ${portFragment}
  ${partnerCardFragment}
`;

export const updateBatchWithReturnDataMutation = gql`
  mutation batchUpdate($id: ID!, $input: BatchUpdateInput!) {
    batchUpdate(id: $id, input: $input) {
      batch {
        ...batchCardFragment
        packageSize {
          ...sizeFragment
        }
        shipment {
          ...shipmentRMFragment
        }
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
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
`;
