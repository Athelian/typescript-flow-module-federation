// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import { productProviderListFragment } from 'graphql/productProviderList/fragment';
import { detailedBatchFragment } from 'graphql/batchDetail/fragment';
import type { ShipmentCreate, ShipmentUpdate } from '../type.js.flow';

export const createShipmentMutation = gql`
  mutation shipmentCreate($input: ShipmentCreateInput!) {
    shipmentCreate(input: $input) {
      shipment {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }
  ${violationFragment}
`;

export const prepareCreateShipmentInput = ({ no }: Object): ShipmentCreate => ({
  no,
});

export const updateShipmentMutation = gql`
  mutation shipmentUpdate($id: ID!, $input: ShipmentUpdateInput!) {
    shipmentUpdate(id: $id, input: $input) {
      shipment {
        id
      }
      violations {
        ...violationFragment
      }
    }
  }

  ${productProviderListFragment}
  ${detailedBatchFragment}
  ${violationFragment}
`;

export const prepareUpdateShipmentInput = ({ no }: Object): ShipmentUpdate => ({
  no,
});
