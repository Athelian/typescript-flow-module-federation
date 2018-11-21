// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import {
  orderFormFragment,
  shipmentFormFragment,
  userAvatarFragment,
  tagFragment,
  partnerCardFragment,
  documentFragment,
  shipmentCardFragment,
  priceFragment,
  imageFragment,
  partnerNameFragment,
  timelineDateMinimalFragment,
  portFragment,
  batchFormFragment,
  metricFragment,
  sizeFragment,
  orderCardFragment,
  timelineDateFullFragment,
} from 'graphql';

export const entitiesUpdateManyMutation = gql`
  mutation entitiesUpdateMany(
    $orders: [OrderUpdateWrapperInput!]
    $shipments: [ShipmentUpdateWrapperInput!]
    $products: [ProductUpdateWrapperInput!]
    $batches: [BatchUpdateWrapperInput!]
    $warehouses: [WarehouseUpdateWrapperInput!]
  ) {
    entitiesUpdateMany(
      orders: $orders
      shipments: $shipments
      products: $products
      batches: $batches
      warehouses: $warehouses
    ) {
      orders {
        orders {
          ...orderFormFragment
        }
        violations {
          ...violationFragment
        }
      }
      shipments {
        shipments {
          ...shipmentFormFragment
        }
        violations {
          ...violationFragment
        }
      }
      products {
        violations {
          ...violationFragment
        }
      }
      batches {
        violations {
          ...violationFragment
        }
      }
      warehouses {
        violations {
          ...violationFragment
        }
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
  ${shipmentFormFragment}
  ${timelineDateFullFragment}
`;

export default entitiesUpdateManyMutation;
