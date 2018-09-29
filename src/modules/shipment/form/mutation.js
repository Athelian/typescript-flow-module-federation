// @flow
import gql from 'graphql-tag';
import { violationFragment } from 'graphql/violations/fragment';
import { prepareUpdateBatchInput } from 'modules/batch/form/mutation';
import { cleanUpData } from 'utils/data';
import type {
  CargoReady,
  ShipmentVoyage,
  ShipmentGroups,
  ShipmentCreate,
  ShipmentUpdate,
} from '../type.js.flow';

const formatTimeline = (timeline: Object): ?CargoReady => {
  if (!timeline) return null;

  const { assignedTo = [], memo, approvedBy, date, timelineDateRevisions = [] } = timeline;

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

const formatVoyages = (voyages: Array<Object>): Array<ShipmentVoyage> =>
  voyages.map(({ departure, arrival, arrivalPort, departurePort, vesselName, vesselCode }) => ({
    vesselCode,
    vesselName,
    departurePort: !departurePort
      ? null
      : {
          airport: departurePort && departurePort.airport ? departurePort.airport : null,
          seaport: departurePort && departurePort.seaport ? departurePort.seaport : null,
        },
    departure: !departure ? null : formatTimeline(departure),
    arrivalPort: !arrivalPort
      ? null
      : {
          airport: arrivalPort && arrivalPort.airport ? arrivalPort.airport : null,
          seaport: arrivalPort && arrivalPort.seaport ? arrivalPort.seaport : null,
        },
    arrival: !arrival ? null : formatTimeline(arrival),
  }));

const formatContainers = (voyages: Array<Object>): Array<ShipmentGroups> =>
  voyages.map(({ warehouse, customClearance, warehouseArrival, deliveryReady }) => ({
    warehouseId: warehouse && warehouse.id,
    customClearance: !customClearance ? null : formatTimeline(customClearance),
    warehouseArrival: !warehouseArrival ? null : formatTimeline(warehouseArrival),
    deliveryReady: !deliveryReady ? null : formatTimeline(deliveryReady),
  }));

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
  voyages = [],
  containerGroups = [],
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
  cargoReady: formatTimeline(cargoReady),
  tagIds: tags.map(({ id }) => id),
  forwarderIds: forwarders.map(({ id }) => id),
  voyages: formatVoyages(voyages),
  batches: batches.map(batch => prepareUpdateBatchInput(cleanUpData(batch), true)),
  containerGroups: formatContainers(containerGroups),
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
  voyages = [],
  containerGroups = [],
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
  cargoReady: formatTimeline(cargoReady),
  tagIds: tags.map(({ id }) => id),
  forwarderIds: forwarders.map(({ id }) => id),
  batches: batches.map(batch => prepareUpdateBatchInput(cleanUpData(batch), true)),
  voyages: formatVoyages(voyages),
  containerGroups: formatContainers(containerGroups),
});
