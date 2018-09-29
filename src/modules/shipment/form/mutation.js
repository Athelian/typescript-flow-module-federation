// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import { prepareUpdateBatchInput } from 'modules/batch/form/mutation';
import type { CargoReady, ShipmentCreate, ShipmentUpdate } from '../type.js.flow';

const formatCargoReady = (cargoReady: Object): CargoReady => {
  const { assignedTo = [], memo, approvedBy, date, timelineDateRevisions = [] } = cargoReady;

  return {
    memo,
    date: date ? new Date(date) : null,
    assignedToIds: assignedTo.map(({ id }) => id),
    timelineDateRevisions: timelineDateRevisions
      .filter(item => item && (item.date || item.memo))
      .map(({ date: dateRevision, type, memo: memoRevision }) => ({
        type,
        memo: memoRevision,
        date: dateRevision ? new Date(dateRevision) : null,
      })),
    approvedById: approvedBy && approvedBy.id,
  };
};

export const createShipmentMutation: Object = gql`
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
  batches = [],
  forwarders = [],
}: Object): ShipmentCreate => ({
  no,
  blNo,
  blDate: blDate ? new Date(blDate) : null,
  bookingNo,
  bookingDate: bookingDate ? new Date(bookingDate) : null,
  invoiceNo,
  loadType: loadType && loadType.length > 0 ? loadType : null,
  transportType: transportType && transportType.length > 0 ? transportType : null,
  incoterm: incoterm && incoterm.length > 0 ? incoterm : null,
  carrier,
  cargoReady: formatCargoReady(cargoReady),
  tagIds: tags.map(({ id }) => id),
  forwarderIds: forwarders.map(({ id }) => id),
  voyages,
  batches: batches.map(batch => prepareUpdateBatchInput(batch, true)),
  containerGroups,
});

export const updateShipmentMutation: Object = gql`
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
  batches = [],
  forwarders = [],
}: Object): ShipmentUpdate => ({
  no,
  blNo,
  blDate: blDate ? new Date(blDate) : null,
  bookingNo,
  bookingDate: bookingDate ? new Date(bookingDate) : null,
  invoiceNo,
  loadType: loadType && loadType.length > 0 ? loadType : null,
  transportType: transportType && transportType.length > 0 ? transportType : null,
  incoterm: incoterm && incoterm.length > 0 ? incoterm : null,
  carrier,
  cargoReady,
  tagIds: tags.map(({ id }) => id),
  forwarderIds: forwarders.map(({ id }) => id),
  batches: batches.map(prepareUpdateBatchInput),
  voyages,
  containerGroups,
});
