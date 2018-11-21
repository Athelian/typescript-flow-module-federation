// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';

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
        violations {
          ...violationFragment
        }
      }
      shipments {
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
`;

export default entitiesUpdateManyMutation;
