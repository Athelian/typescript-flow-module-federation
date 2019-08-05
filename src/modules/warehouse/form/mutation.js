// @flow
import gql from 'graphql-tag';
import { badRequestFragment } from 'graphql';

export const prepareInput = ({ inCharges, organizations, ...rest }: Object) => ({
  ...(Array.isArray(inCharges)
    ? {
        inChargeIds: inCharges.map(({ id }) => id),
      }
    : {}),
  ...(Array.isArray(organizations)
    ? {
        organizationIds: organizations.map(({ id }) => id),
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
