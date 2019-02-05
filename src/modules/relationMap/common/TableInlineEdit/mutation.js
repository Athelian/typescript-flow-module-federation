// @flow
import gql from 'graphql-tag';
import {
  orderFormFragment,
  shipmentFormFragment,
  shipmentContainerCardFragment,
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
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  badRequestFragment,
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
        ...orderFormFragment
        ...badRequestFragment
      }
      shipments {
        ...shipmentFormFragment
        ...badRequestFragment
      }
      products {
        ...badRequestFragment
      }
      batches {
        ...badRequestFragment
      }
      warehouses {
        ...badRequestFragment
      }
    }
  }
  ${badRequestFragment}
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
  ${shipmentContainerCardFragment}
  ${timelineDateFullFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
`;

export default entitiesUpdateManyMutation;
