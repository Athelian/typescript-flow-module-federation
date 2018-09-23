// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';

import { warehouseDetailFragment } from './query';

export const createWarehouseMutation = gql`
  mutation warehouseCreate($input: WarehouseCreateInput!) {
    warehouseCreate(input: $input) {
      warehouse {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
`;

export const updateWarehouseMutation = gql`
  mutation warehouseUpdateMutation($id: ID!, $input: WarehouseUpdateInput!) {
    warehouseUpdate(id: $id, input: $input) {
      warehouse {
        ...warehouseDetailFragment
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${warehouseDetailFragment}
  ${violationFragment}
`;
