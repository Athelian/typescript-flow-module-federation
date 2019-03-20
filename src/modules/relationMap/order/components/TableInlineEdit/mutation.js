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
  orderTableFragment,
  shipmentTableFragment,
  orderItemTableFragment,
  batchTableFragment,
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
        ...orderTableFragment
        ...badRequestFragment
      }
      shipments {
        ...shipmentTableFragment
        ...badRequestFragment
      }
      products {
        ...badRequestFragment
      }
      batches {
        ...batchTableFragment
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
  ${batchTableFragment}
  ${metricFragment}
  ${sizeFragment}
  ${customFieldsFragment}
  ${maskFragment}
  ${fieldValuesFragment}
  ${fieldDefinitionFragment}
  ${orderItemTableFragment}
  ${orderTableFragment}
  ${shipmentTableFragment}
`;

export default entitiesUpdateManyMutation;
