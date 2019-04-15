// @flow
import gql from 'graphql-tag';
import {
  userAvatarFragment,
  tagFragment,
  priceFragment,
  partnerNameFragment,
  timelineDateFullFragment,
  portFragment,
  metricFragment,
  sizeFragment,
  customFieldsFragment,
  maskFragment,
  fieldValuesFragment,
  fieldDefinitionFragment,
  badRequestFragment,
} from 'graphql';
import {
  orderEntityFragment,
  orderItemEntityFragment,
  shipmentEntityFragment,
  batchEntityFragment,
  productEntityFragment,
} from './query';

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
        ... on Order {
          ...orderEntityFragment
          orderItems {
            ...orderItemEntityFragment
          }
        }
        ...badRequestFragment
      }
      shipments {
        ...shipmentEntityFragment
        ...badRequestFragment
      }
      products {
        ...productEntityFragment
        ...badRequestFragment
      }
      batches {
        ...batchEntityFragment
        ...badRequestFragment
      }
      warehouses {
        ...badRequestFragment
      }
    }
  }
  ${badRequestFragment}
  ${userAvatarFragment}
  ${tagFragment}
  ${priceFragment}
  ${partnerNameFragment}
  ${timelineDateFullFragment}
  ${portFragment}
  ${batchEntityFragment}
  ${metricFragment}
  ${sizeFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${orderItemEntityFragment}
  ${orderEntityFragment}
  ${shipmentEntityFragment}
  ${productEntityFragment}
`;

export default entitiesUpdateManyMutation;
