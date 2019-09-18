// @flow
import gql from 'graphql-tag';
import { badRequestFragment, forbiddenFragment } from 'graphql';

export const entitiesUpdateManyMutation = gql`
  mutation entitiesUpdateMany(
    $orders: [OrderUpdateWrapperInput!]
    $shipments: [ShipmentUpdateWrapperInput!]
    $products: [ProductUpdateWrapperInput!]
    $batches: [BatchUpdateWrapperInput!]
    $warehouses: [WarehouseUpdateWrapperInput!]
    $containers: [ContainerUpdateWrapperInput!]
  ) {
    entitiesUpdateMany(
      orders: $orders
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
    }
  }

  ${badRequestFragment}
  ${forbiddenFragment}
`;

export default entitiesUpdateManyMutation;
