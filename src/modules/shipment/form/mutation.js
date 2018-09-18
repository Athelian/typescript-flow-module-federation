// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
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

export const prepareCreateShipmentInput = ({
  no,
  blNo,
  blDate,
  bookingNo,
  bookingDate,
  invoiceNo,
  loadType,
  transportType,
  incoterm,
  carrier,
  cargoReady,
  voyages,
  containerGroups,
  tags = [],
  forwarders = [],
}: Object): ShipmentCreate => ({
  no,
  blNo,
  blDate,
  bookingNo,
  bookingDate,
  invoiceNo,
  loadType,
  transportType,
  incoterm,
  carrier,
  cargoReady,
  tagIds: tags.map(({ id }) => id),
  forwarderIds: forwarders.map(({ id }) => id),
  voyages,
  containerGroups,
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
  ${violationFragment}
`;

export const prepareUpdateShipmentInput = ({
  no,
  blNo,
  blDate,
  bookingNo,
  bookingDate,
  invoiceNo,
  loadType,
  transportType,
  incoterm,
  carrier,
  cargoReady,
  voyages,
  containerGroups,
  tags = [],
  forwarders = [],
}: Object): ShipmentUpdate => ({
  no,
  blNo,
  blDate,
  bookingNo,
  bookingDate,
  invoiceNo,
  loadType,
  transportType,
  incoterm,
  carrier,
  cargoReady,
  tagIds: tags.map(({ id }) => id),
  forwarderIds: forwarders.map(({ id }) => id),
  voyages,
  containerGroups,
});
