// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const entitiesUpdateManyMutation = gql`
  mutation entitiesUpdateMany(
    $orders: [OrderUpdateWrapperInput!]
    $orderItems: [OrderItemUpdateWrapperInput!]
    $shipments: [ShipmentUpdateWrapperInput!]
    $products: [ProductUpdateWrapperInput!]
    $batches: [BatchUpdateWrapperInput!]
    $warehouses: [WarehouseUpdateWrapperInput!]
    $containers: [ContainerUpdateWrapperInput!]
  ) {
    entitiesUpdateMany(
      orders: $orders
      orderItems: $orderItems
      shipments: $shipments
      products: $products
      batches: $batches
      warehouses: $warehouses
      containers: $containers
    ) {
      orders {
        ... on Order {
          id
        }
        ...badRequestFragment
        ...forbiddenFragment
      }
      orderItems {
        ... on OrderItem {
          id
        }
        ...badRequestFragment
        ...forbiddenFragment
      }
      shipments {
        ... on Shipment {
          id
        }
        ...badRequestFragment
        ...forbiddenFragment
      }
      batches {
        ... on Batch {
          id
        }
        ...badRequestFragment
        ...forbiddenFragment
      }
      containers {
        ... on Container {
          id
        }
        ...badRequestFragment
        ...forbiddenFragment
      }
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default entitiesUpdateManyMutation;
