// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';

export const prepareInput = ({ inCharges, groups, ...rest }: Object) => ({
  ...(Array.isArray(inCharges)
    ? {
        inChargeIds: inCharges.map(({ id }) => id),
      }
    : {}),
  ...(Array.isArray(groups)
    ? {
        groupIds: groups.map(({ id }) => id),
      }
    : {}),
  ...rest,
});

export const createWarehouseMutation = gql`
  mutation warehouseCreate($input: WarehouseCreateInput!) {
    warehouseCreate(input: $input) {
      ... on Warehouse {
        id
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;

export const updateWarehouseMutation = gql`
  mutation warehouseUpdateMutation($id: ID!, $input: WarehouseUpdateInput!) {
    warehouseUpdate(id: $id, input: $input) {
      ... on Warehouse {
        id
      }
      ...badRequestFragment
    }
  }
  ${badRequestFragment}
`;
